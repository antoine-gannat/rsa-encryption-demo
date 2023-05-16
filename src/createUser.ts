import { decrypt, encrypt, generateKeys } from "./crypto";

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
    const type = message.split(":")[0];
    const content = message.split(":")[1]?.trim();

    switch (type) {
      // if public key, store it
      case "KEY":
        store.otherKey = {
          publicKey: content,
        };
        // user A will send a message
        if (name === "a") {
          // encrypt a message using the other user's public key
          console.log("MESSAGE:", encrypt("Hello", store.otherKey.publicKey));
        }
        break;
      case "MESSAGE":
        // user B will receive the message and decrypt it
        console.info("DECRYPTED:", decrypt(content, store.ownKeys.privateKey));
        break;
    }
  });

  // read own keys
  const keys = generateKeys();
  store.ownKeys = {
    publicKey: keys.publicKey
      .export({
        type: "pkcs1",
        format: "pem",
      })
      .toString(),
    privateKey: keys.privateKey
      .export({
        type: "pkcs1",
        format: "pem",
      })
      .toString(),
  };

  // send private key to other user
  console.log("KEY:", store.ownKeys.publicKey);
  console.log("PRIVKEY:", store.ownKeys.privateKey);
}
