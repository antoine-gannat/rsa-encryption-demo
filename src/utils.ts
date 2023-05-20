type MessageType = "KEY" | "ENC_MSG" | "LOG";

// Parse a message like "type:content" into {type, content}
export function parseMessage(
  msg: string
): { type: MessageType; content: string } | null {
  // start by trimming the message
  const message = msg.trim();
  // find type separator
  const firstSeparator = message.indexOf(":");
  if (firstSeparator === -1) {
    return null;
  }
  // cut and trim
  const type = message.substring(0, firstSeparator).trim() as MessageType;
  // cut and trim
  const content = message.substring(firstSeparator + 1).trim();
  return { type, content };
}

// Sends a message to the other user by writing it to STDOUT
export function talk(type: MessageType, content: string) {
  console.log(`${type}:${content}`);
}
