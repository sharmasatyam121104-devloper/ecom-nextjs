import serverCatchError from "@/lib/server-catch-error";
import CartModel from "@/models/cart.model";
import OrderModel from "@/models/order.model";
import PaymentModel from "@/models/payment.model";
import crypto from "crypto";
import fs from "fs";
import moment from "moment";
import { NextRequest, NextResponse as res } from "next/server";

/* -------------------------------- INTERFACES -------------------------------- */

interface CreateOrderInterface {
  userId: string;
  productIds: string[];
  prices: number[];
  discounts: number[];
}

interface CreatePaymentInterface {
  userId: string;
  orderId: string;
  paymentId: string;
  vendor?: "razorpay" | "stripe";
}

interface DeleteCartsInterface {
  userId: string;
  productId: string[]
}

/* -------------------------------- HELPERS -------------------------------- */

const writeLog = (type: "ORDER" | "PAYMENT" | "DELETE-CARTS", message: string) => {
  const dateTime = moment().format("DD-MM-YY-hh-mm-ss-A");
  fs.mkdirSync("logs", { recursive: true });
  fs.writeFileSync(`logs/${dateTime}-${type}_ERR_LOG.txt`, message);
};

const createOrder = async (order: CreateOrderInterface) => {
  try {
    const { _id } = await OrderModel.create(order);
    return _id;
  } catch (error) {
    if (error instanceof Error) {
      writeLog("ORDER", error.message);
    }
    return null;
  }
};

const createPayment = async (payment: CreatePaymentInterface) => {
  try {
    await PaymentModel.create(payment);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      writeLog("PAYMENT", error.message);
    }
    return false;
  }
};

const deleteCarts = async (carts: DeleteCartsInterface) => {
  try {
    const query = carts.productId.map((productId)=>({userId: carts.userId, productId: productId}))
    await CartModel.deleteMany({$or: query})
  } 
  catch (error) {
    if (error instanceof Error) {
      writeLog("DELETE-CARTS", error.message);
    }
    return false;
  }
};

/* -------------------------------- WEBHOOK -------------------------------- */

export const POST = async (req: NextRequest) => {
  try {
    /* --------- 1. GET RAW BODY (VERY IMPORTANT) --------- */
    const rawBody = await req.text();

    /* --------- 2. SIGNATURE VERIFY --------- */
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return res.json({ message: "Signature missing" }, { status: 400 });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (signature !== generatedSignature) {
      return res.json({ message: "Invalid signature" }, { status: 400 });
    }

    /* --------- 3. PARSE BODY --------- */
    const body = JSON.parse(rawBody);

    const paymentEntity = body.payload.payment.entity;

    const userId = paymentEntity.notes.userId;
    const orders = JSON.parse(paymentEntity.notes.orders);
    const paymentId = paymentEntity.id;

    /* --------- 4. TYPE FIX --------- */
    orders.prices = orders.prices.map(Number);
    orders.discounts = orders.discounts.map(Number);

    /* --------- 5. HANDLE EVENTS --------- */

    // Only create order when payment is CAPTURED
    if (body.event === "payment.captured") {
      const orderId = await createOrder({
        userId,
        ...orders,
      });

      if (!orderId) {
        return res.json(
          { message: "Failed to create order" },
          { status: 424 }
        );
      }

      const paymentCreated = await createPayment({
        userId,
        orderId,
        paymentId,
        vendor: "razorpay",
      });

      if (!paymentCreated) {
        return res.json(
          { message: "Failed to create payment" },
          { status: 424 }
        );
      }

      await deleteCarts({userId, productId: orders.productIds })
      return res.json({ success: true });
    }

    if (body.event === "payment.failed") {
      console.log("Payment failed:", paymentId);
      return res.json({ success: true });
    }

    return res.json({ success: true });
  } catch (error) {
    return serverCatchError(error);
  }
};
