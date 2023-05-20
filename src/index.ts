/**
 * This file is used to make the two users talk to each other.
 *
 * It spawns two processes, one for each user, and redirects their STDOUT to the other user's STDIN.
 */

import { spawn } from "child_process";
import * as path from "path";

// spawn a process per "user"
const processA = spawn("node", [
  path.join(__dirname, "userA"),
  process.argv[2] || "",
]);
const processB = spawn("node", [path.join(__dirname, "userB")]);

// intercept logs and print them to the console
function interceptLogs(message: string, user: "A" | "B"): boolean {
  if (message.includes("LOG:")) {
    const parsedMessage = message
      .slice("LOG:".length, /* remove the new line */ -1)
      .trim();

    // log the intercepted message
    console.log(`Log USER_${user}:`, parsedMessage);
    return true;
  }
  return false;
}

// make processes talk to each other by redirecting STDOUT to STDIN
processA.stdout.on("data", (data: string) => {
  if (interceptLogs(data.toString(), "A")) {
    return;
  }
  processB.stdin.write(data);
});

processB.stdout.on("data", (data) => {
  if (interceptLogs(data.toString(), "B")) {
    return;
  }
  processA.stdin.write(data);
});

// Log errors
processA.stderr.on("data", (data) => {
  console.error("USER_A:", data.toString());
});

processB.stderr.on("data", (data) => {
  console.error("USER_B:", data.toString());
});
