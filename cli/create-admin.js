import dotenv from 'dotenv'
dotenv.config()

import chalk from "chalk"
import prompts from "prompts"
import bcrypt from "bcrypt"
import { MongoClient } from "mongodb"

const log = console.log

/* -------------------- UI Helpers -------------------- */

// Ek clean border aur brand name ke liye
const printHeader = () => {
  log(chalk.cyan.bold("\n" + "=".repeat(40)))
  log(chalk.white.bgBlue.bold("      🛒 ECOM - BACKOFFICE SYSTEM      "))
  log(chalk.cyan.bold("=".repeat(40) + "\n"))
}

const printSuccess = (msg) => log(chalk.green.bold(`\n✔ ${msg}\n`))
const printError = (msg) => log(chalk.red.bold(`\n✘ ${msg}\n`))

/* -------------------- validations -------------------- */

const requiredValidation = (input, name) => {
  if (input && input.trim().length > 0) return true
  return `${name} is required!`
}

const emailValidation = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (regex.test(email)) return true
  return "Please enter a valid email address"
}

const passwordValidation = (input) => {
  if (input.length < 6) return "Password must be at least 6 characters"
  return true
}

/* -------------------- prompts -------------------- */

const rolePrompt = {
  type: "select",
  name: "role",
  message: chalk.white.bold("Action: Select Access Level"),
  choices: [
    { title: chalk.blue("👤 Create User"), value: "user" },
    { title: chalk.magenta("🔑 Create Admin"), value: "admin" },
    { title: chalk.dim("🚪 Exit System"), value: "exit" }
  ],
  initial: 0
}

const inputOptions = [
  {
    type: "text",
    name: "fullname",
    message: chalk.white("Full Name:"),
    validate: (input) => requiredValidation(input, "Fullname")
  },
  {
    type: "text",
    name: "email",
    message: chalk.white("Email Address:"),
    validate: (input) => {
      const req = requiredValidation(input, "Email")
      if (req !== true) return req
      return emailValidation(input)
    }
  },
  {
    type: "password",
    name: "password",
    message: chalk.white("Security Password:"),
    validate: (input) => {
      const req = requiredValidation(input, "Password")
      if (req !== true) return req
      return passwordValidation(input)
    }
  }
]

/* -------------------- core logic (Untouched) -------------------- */

const createRole = async (role, db, client) => {
  try {
    log(chalk.gray(`\n--- Registering New ${role.toUpperCase()} ---`))
    const input = await prompts(inputOptions)

    // Check if user cancelled (Ctrl+C)
    if (Object.keys(input).length < 3) throw new Error("Operation cancelled by user")

    input.password = await bcrypt.hash(input.password, 12)
    input.role = role
    input.createdAt = new Date()
    input.updatedAt = new Date()
    input.__v = 0

    const User = db.collection("users")
    await User.insertOne(input)

    printSuccess(`${role.toUpperCase()} ACCOUNT CREATED SUCCESSFULLY`)
    
    await client.close()
    process.exit(0)
  } catch (err) {
    printError(`Signup Failed: ${err.message}`)
    await client.close()
    process.exit(1)
  }
}

const exitApp = async (client) => {
  log(chalk.gray("\nSystem shutting down..."))
  log(chalk.blue("👋 Thank you for using Ecom Control Panel."))
  await client.close()
  process.exit(0)
}

const welcome = async (db, client) => {
  printHeader()
  const { role } = await prompts(rolePrompt)

  if (!role || role === "exit") return exitApp(client)
  return createRole(role, db, client)
}

/* -------------------- entry -------------------- */

const main = async () => {
  try {
    // Connection loader visual effect
    process.stdout.write(chalk.yellow("📡 Connecting to Ecom Database... "))
    
    const client = new MongoClient(process.env.DB_URL)
    await client.connect()
    
    process.stdout.write(chalk.green("CONNECTED\n"))
    
    const db = client.db(process.env.DB_NAME)
    await welcome(db, client)
  } catch (err) {
    log(chalk.redBright("\n❌ DATABASE CONNECTION ERROR"))
    log(chalk.dim(err.message))
    process.exit(1)
  }
}

main()