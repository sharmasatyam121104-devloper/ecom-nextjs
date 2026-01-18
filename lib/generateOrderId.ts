import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0,O,I,l
const nanoid = customAlphabet(alphabet, 6);

export function generateOrderId() {
  return `ORD-${nanoid()}`;
}