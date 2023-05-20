/**
 * This file contains the functions used to generate RSA keys and encrypt/decrypt messages.
 */

// @ts-ignore (big-number doesn't have types)
import * as BigNumber from "big-number";
import { primes } from "./primeNumbers";

interface Key {
  n: number;
  e: number;
  d: number;
}

type PublicKey = Pick<Key, "n" | "e">;

// Calculate the greatest common divisor of 2 numbers (https://en.wikipedia.org/wiki/Greatest_common_divisor)
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
// Calculate the least common multiple of 2 numbers using the Euclidean algorithm (https://en.wikipedia.org/wiki/Euclidean_algorithm)
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
// Calculate the modular multiplicative inverse of 2 numbers using the Extended Euclidian algorithm (https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm)
const modularMultiplicativeInverse = (a: number, b: number): number => {
  let x1 = 1,
    x2 = 0,
    y1 = 0,
    y2 = 1;
  while (b > 0) {
    const q = Math.floor(a / b);
    const r = a - q * b;
    a = b;
    b = r;
    const x = x2;
    const y = y2;
    x2 = x1 - q * x2;
    x1 = x;
    y2 = y1 - q * y2;
    y1 = y;
  }
  return x1;
};

export function generateKeyPair(): Key {
  // get 2 random prime numbers
  const p = primes[Math.floor(Math.random() * primes.length)];
  // get an other number that is not p
  const filteredPrimes = primes.filter((num) => num !== p);
  const q = filteredPrimes[Math.floor(Math.random() * filteredPrimes.length)];

  // calculate phi using Euclidian algorithm
  const phi = lcm(p - 1, q - 1);

  // calculate n (modulus)
  const n = p * q;
  // public exponent
  const e = 17;

  const d = modularMultiplicativeInverse(e, phi) + phi;

  console.log("LOG: Generating key pair using primes:", { p, q }, "Result:", {
    n,
    e,
    d,
  });

  return {
    n,
    e,
    d,
  };
}

/**
 * Encrypt a message using a public key.
 *
 * The encryption is done using: encryptedCharCode = char_code^e % n
 *  - char_code is the char code of the character
 *  - e is the public exponent (found in the public key)
 *  - n is the modulus (found in the public and private keys)
 */
export function encrypt(message: string, publicKey: string): string {
  const { n, e } = JSON.parse(publicKey) as PublicKey;
  // for each character in the mesasge
  const encryptedMessage = message.split("").map((char) => {
    // get the char code
    const charCode = char.charCodeAt(0);
    // encrypt the char code using exponent and modulus
    const encryptedCharCode = BigNumber(charCode).pow(e).mod(n).toString();
    return encryptedCharCode;
  });
  return encryptedMessage.join(",");
}

/**
 * Decrypt a message using a private key.
 *
 * The decryption is done using: decryptedCharCode = encrypted_char_code^d % n
 * - encrypted_char_code is the encrypted char code
 * - d is the private exponent (found in the private key)
 * - n is the modulus (found in the public and private keys)
 */
export function decrypt(encryptedMessage: string, privateKey: string): string {
  const { n, d } = JSON.parse(privateKey) as Key;

  const decryptedMessage = encryptedMessage.split(",").map((encryptedChar) => {
    // decrypt
    const decryptedCharCode = BigNumber(encryptedChar).pow(d).mod(n).toString();
    // convert to char
    return String.fromCharCode(Number(decryptedCharCode));
  });

  return decryptedMessage.join("");
}
