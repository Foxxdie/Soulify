import { Soul } from "@opensouls/engine";
import { config } from "dotenv";
import { Context, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
 
async function connectToTelegram() {
  const telegraf = new Telegraf<Context>(process.env.TELEGRAM_TOKEN!);
  telegraf.launch();
 
  const { username } = await telegraf.telegram.getMe();
  console.log(`Start chatting here: https://t.me/${username}`);
 
  process.once("SIGINT", () => telegraf.stop("SIGINT"));
  process.once("SIGTERM", () => telegraf.stop("SIGTERM"));
 
  return telegraf;
}
 
async function connectToSoulEngine(telegram: Telegraf<Context>) {
  // this is temporary, we will connect to the soul later
  
  telegram.start(async (ctx) => ctx.reply("👋"));
  telegram.on(message("text"), async (ctx) => ctx.reply("👍"));
}
 
async function run() {
  config();
  const telegram = await connectToTelegram();
  connectToSoulEngine(telegram);
}
 
run();