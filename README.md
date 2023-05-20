# RSA key generation/encryption/decryption demo

This project shows how to generate an RSA key pair, encrypt a message and decrypt it.

To do so, we have two users, A and B:

1. User B will generate an RSA key-pair (public+private)
2. User B will send the public key to user A
3. User A will use that public key to encrypt a message
4. User A will send that encrypted message to user B
5. User B will use the private key to decrypt the encrypted message

## Usage

- Install `yarn` and `NodeJS`

- Install dependencies and build the project:

  `yarn && yarn build`

- Run the demo:

  `yarn start <message>`

## Example

```
$ yarn start "Hello world"
USER_B: Generating key pair using primes: p=17, q=41. Result: n=697, e=17, d=113

USER_A: Received public key {"e":17,"n":697}
USER_A: Sending encypted message: [310,509,142,142,417,32,221,417,114,142,406]

USER_B: Decrypting message: [310,509,142,142,417,32,221,417,114,142,406] using private key: {"n":697,"e":17,"d":113}
USER_B: Message decrypted to: "Hello world"
```

## Third party libraries

I used the library `big-number` to handle the `power` and `modulo` operations, since NodeJS does not support very large number operation.

## Notes

I've noticed that sometimes when using large primes, the decryption fails. I believe that might be due to the very large
modulo operations that have to be done when using large primes, might be caused by the `big-number` library.

If this is indeed the problem, a solution could be to create or find an other inifite-numbers calculator.

## Useful links

https://en.wikipedia.org/wiki/RSA_(cryptosystem)

https://en.wikipedia.org/wiki/List_of_prime_numbers

https://www.npmjs.com/package/big-number
