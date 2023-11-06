import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
require('dotenv').config();
const fs = require('fs');
//import { StringSession } from "telegram/sessions";


const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;

(async () => {
  console.log("Loading interactive example...");
  let client;
  if (process.env.SESSION !== undefined) {
    const stringSession = new StringSession(process.env.SESSION); // fill this later with the value from session.save()
    client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
  } else {
    client = new TelegramClient(new StringSession(), apiId, apiHash, {
      connectionRetries: 5,
    });
  }
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
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