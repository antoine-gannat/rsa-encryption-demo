import { spawn } from "child_process";
import * as path from "path";

const processA = spawn("node", [path.join(__dirname, "userA")]);
const processB = spawn("node", [path.join(__dirname, "userB")]);

// make processes talk to each other
processA.stdout.on("data", (data: string) => {
  // log messages from user A
  console.log("USER_A:", data.toString());
  processB.stdin.write(data);
});

processA.stderr.on("data", (data) => {
  console.error("USER_A:", data.toString());
});

processB.stdout.on("data", (data) => {
  // log messages from user B
  console.log("USER_B:", data.toString());
  processA.stdin.write(data);
});

processB.stderr.on("data", (data) => {
  console.error("USER_B:", data.toString());
});
