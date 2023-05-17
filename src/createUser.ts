import { decrypt, encrypt, generateKeyPair } from "./crypto";

interface Key {
  publicKey: string;
  privateKey: string;
}

interface Store {
  ownKeys: Key;
  otherKey: Pick<Key, "publicKey">;
}

export function createUser(name: string) {
  const store = {} as Store;

  // listen for data from stdin
  process.stdin.on("data", (data) => {
    const message = data.toString().trim();
    const firstSeparator = message.indexOf(":");
    if (firstSeparator === -1) {
      return;
    }
    const type = message.substring(0, firstSeparator);
    const content = message.substring(firstSeparator + 1);

    switch (type) {
      // if public key, store it
      case "KEY":
        store.otherKey = {
          publicKey: content,
        };
        // user A will send a message
        if (name === "a") {
          const message = "Hello";
          // encrypt a message using the other user's public key
          console.log("LOG:Sending encrypted message", message);
          console.log("MESSAGE:", encrypt(message, store.otherKey.publicKey));
          process.exit(0);
        }
        break;
      case "MESSAGE":
        // user B will receive the message and decrypt it
        console.info(
          "LOG:Text decrypted to:",
          decrypt(content, store.ownKeys.privateKey)
        );
        process.exit(0);
        break;
    }
  });

  // generate a key pair
  const { n, e, d } = generateKeyPair();
  store.ownKeys = {
    publicKey: JSON.stringify({ e, n }),
    privateKey: JSON.stringify({ n, e, d }),
  };

  // send private key to other user
  console.log("KEY:", store.ownKeys.publicKey);
  console.log("PRIVKEY:", store.ownKeys.privateKey);
}
