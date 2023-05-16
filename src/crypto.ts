import { generateKeyPairSync } from "crypto";
import { ASN1 } from "./asn1Parser";
// @ts-ignore
import * as BigNumber from "big-number";

// asn1 tools
// https://coolaj86.com/demos/asn1-parser/
// rsa decoder
// https://8gwifi.org/PemParserFunctions.jsp

export function generateKeys() {
  return generateKeyPairSync("rsa", {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 512,
    publicExponent: 3,
  });
}

export function parseKey(key: string) {
  const isPrivate = key.includes("PRIVATE KEY");
  function bufToHex(u8: Uint8Array) {
    const hex = [];
    let i, h;
    const len = u8.byteLength || u8.length;

    for (i = 0; i < len; i += 1) {
      h = u8[i].toString(16);
      if (h.length % 2) {
        h = "0" + h;
      }
      hex.push(h);
    }

    return hex.join("").toLowerCase();
  }

  // remove the header, footer and new lines from the key
  const parsedKey = key
    .trim()
    .replace(/\n/g, "")
    .replace(/-----(.*?)-----/gm, "");

  // convert the base64 key to binary
  const binary = Buffer.from(parsedKey, "base64").toString("binary");
  // convert the binary key to a Uint8Array
  const binArray = new Uint8Array(
    binary.split("").map((ch) => ch.charCodeAt(0))
  );

  // parse the ASN1 structure
  const parsedAsn1 = ASN1.parse(binArray);

  // finally extact the modulus and exponent
  const modulus = BigNumber(
    BigInt(
      "0x" + bufToHex(parsedAsn1.children[isPrivate ? 1 : 0].value)
    ).toString()
  );
  const exponent = BigNumber(
    BigInt(
      "0x" + bufToHex(parsedAsn1.children[isPrivate ? 3 : 1].value)
    ).toString()
  );
  return { modulus, exponent };
}

export function encrypt(message: string, publicKey: string): string {
  const { exponent, modulus } = parseKey(publicKey);
  // for each character in the mesasge
  const encryptedMessage = message.split("").map((char) => {
    // get the char code
    const charCode = char.charCodeAt(0);
    // encrypt the char code using exponent and modulus
    const encryptedCharCode = BigNumber(charCode)
      .pow(exponent)
      .mod(modulus)
      .toString();
    console.info({
      char,
      charCode: charCode.toString(),
      exponent: exponent.toString(),
      modulus: modulus.toString(),
      encryptedCharCode,
    });

    //    console.info(charCode + `[${char}]`, "=>", encryptedCharCode);

    return encryptedCharCode;
  });
  return encryptedMessage.join(",");
}

export function decrypt(encryptedMessage: string, privateKey: string): string {
  console.log("decrypt");
  const { exponent, modulus } = parseKey(privateKey);

  const decryptedMessage = encryptedMessage.split(",").map((encryptedChar) => {
    // encrypt the char code using exponent and modulus
    try {
      const decryptedCharCode = BigNumber(encryptedChar)
        .pow(exponent)
        .mod(modulus)
        .toString();

      console.info(encryptedChar, "=>", decryptedCharCode);

      return String.fromCharCode(Number(decryptedCharCode));
    } catch (e) {
      console.error(e);
    }
  });

  return decryptedMessage.join("");
}
