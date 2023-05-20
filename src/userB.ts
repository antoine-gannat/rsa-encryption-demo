/**
 * This file is used to simulate a user that receives a message from another user.
 *
 * This user generates a key pair, sends its public key to the other user, then waits for a message to decrypt.
 */

import { decrypt, generateKeyPair } from "./crypto";
import { parseMessage, talk } from "./utils";

// generate the key pair
const { n, e, d } = generateKeyPair();
// private key contains {n, e, d}
const privateKey = JSON.stringify({ n, e, d });
// public key is {n, e}, it doesn't have the private exponent d
const publicKey = JSON.stringify({ e, n });

// send public key to other user, the private key is kept secret
talk("KEY", publicKey);

// setup listener for data
process.stdin.on("data", (data) => {
  const parsedMessage = parseMessage(data.toString());
  if (!parsedMessage) {
    return;
  }
  const { type, content } = parsedMessage;

  // wait for ENC_MSG message
  if (type !== "ENC_MSG") {
    return;
  }
  // decrypt the message using the private key
  const decryptedMessage = decrypt(content, privateKey);
  // Log the decrypted message
  talk("LOG", `Text decrypted to: ${decryptedMessage}`);

  // job done, exit the process
  process.exit(0);
});
