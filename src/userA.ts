/**
 * This file is used to simulate a user that sends a message to another user.
 *
 * This user waits for the other user to send its public key, then encrypts a message using the other user's public key and sends it back.
 */

import { encrypt } from "./crypto";
import { parseMessage, talk } from "./utils";

process.stdin.on("data", (data) => {
  const parsedMessage = parseMessage(data.toString());
  if (!parsedMessage) {
    return;
  }
  const { type, content } = parsedMessage;

  // wait for KEY message

  if (type !== "KEY") {
    return;
  }

  const publicKeyOfOtherUser = content;
  const messageToSend = process.argv[2] || "Hello World!";

  // encrypt a message using the other user's public key
  const encryptedMessage = encrypt(messageToSend, publicKeyOfOtherUser);
  // send the encrypted message back
  talk("ENC_MSG", encryptedMessage);
  talk("LOG", `Sending encypted message: [${encryptedMessage}]`);

  // job done, exit the process
  process.exit(0);
});
