// @ts-ignore
import * as BigNumber from "big-number";
import { primes } from "./primeNumbers";

interface Key {
  n: number;
  e: number;
  d: number;
}

type PublicKey = Pick<Key, "n" | "e">;

export function generateKeyPair(): Key {
  // get 2 random prime numbers
  const p = primes[Math.floor(Math.random() * primes.length)];
  const q = primes[Math.floor(Math.random() * primes.length)];
  // calculate phi using Euclidian algorithm
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
  const extendedEuclidean = (a: number, b: number): number => {
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

  const phi = lcm(p - 1, q - 1);

  // calculate n (modulus)
  const n = p * q;
  // public exponent
  const e = 17;

  const d = extendedEuclidean(e, phi) + phi;

  return {
    n,
    e,
    d,
  };
}

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
