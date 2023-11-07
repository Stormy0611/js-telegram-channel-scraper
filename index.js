import { TelegramClient, password } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
//import { StringSession } from "telegram/sessions";

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;

let client;
let phoneNumber;
let passowrd;
(async () => {
  console.log("Loading interactive example...");
  
  if (process.env.SESSION === undefined || process.env.SESSION == "") {
    client = new TelegramClient(new StringSession(), apiId, apiHash, {
      connectionRetries: 5,
    });
  } else {
    const stringSession = new StringSession(process.env.SESSION); // fill this later with the value from session.save()
    client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
  }
  
  if (process.env.PHONE_NUMBER === undefined || process.env.PHONE_NUMBER == "") {
    phoneNumber = async () => await input.text("Please enter your number: ");
  } else {
    phoneNumber = process.env.PHONE_NUMBER;
  }

  if (process.env.PASSWORD === undefined || process.env.PASSWORD == "") {
    passowrd = async () => await input.text("Please enter your password: ");
  } else {
    passowrd = process.env.PASSWORD
  }

  await client.start({
    phoneNumber: phoneNumber,
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    password: password,
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  const session = client.session.save();
  console.log(session);
  fs.writeFile("session.log", session, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("The log was saved!");
    }
  });
  await client.sendMessage("me", { message: "Hello!" });

  // Get the channel entity
  const channel = await client.getEntity('ETH TRENDING');

  // Get the messages from the channel
  const messages = await client.getMessages(channel, {
    limit: 100, // Replace with your desired limit
  });

  // Log the messages to the console
  messages.forEach((message) => {
    console.log(message.text);
  });

})();