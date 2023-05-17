import { spawn } from "child_process";
import * as path from "path";

const processA = spawn("node", [path.join(__dirname, "userA")]);
const processB = spawn("node", [path.join(__dirname, "userB")]);

// make processes talk to each other
processA.stdout.on("data", (data: string) => {
  // log messages from user A
  if (data.toString().includes("LOG:")) {
    console.log("USER_A:", data.toString().slice(4));
  }
  processB.stdin.write(data);
});

processA.stderr.on("data", (data) => {
  console.error("USER_A:", data.toString());
});

processB.stdout.on("data", (data) => {
  // log messages from user B
  if (data.toString().includes("LOG:")) {
    console.log("USER_B:", data.toString().slice(4));
  }
  processA.stdin.write(data);
});

processB.stderr.on("data", (data) => {
  console.error("USER_B:", data.toString());
});

// import { decrypt, encrypt, generateKeyPair } from "./crypto";

// const raw = "A".split("");
// const key = JSON.stringify(generateKeyPair());
// const encrypted = encrypt("A", key);
// const decrypted = decrypt(encrypted, key);

// console.log({ key, raw, encrypted, decrypted });
