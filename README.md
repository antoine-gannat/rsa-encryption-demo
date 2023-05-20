# RSA key generation/encryption/decryption demo

This project shows how to generate an RSA key pair, encrypt a message and decrypt it.

To do so, we have two users, A and B:

1. User B will generate an RSA key-pair (public+private)
2. User B will send the public key to user A
3. User A will that public key to encrypt a message
4. User A will send that encrypted message to user B
5. User B will use the private key to decrypt the encrypted message

## Usage

- Start by installing dependencies and building the project:

  `yarn && yarn build`

- Then run the demo by using this command:

  `yarn start <message>`

  Such as:

  `yarn start 'Hello world'`

## Third party libraries

I used the library `big-number` to handle the `power` and `modulo` operations, since NodeJS does not support very large number operation.

## Notes

I've noticed that sometimes when using large primes, the decryption fails. I believe that might be due to the very large
modulo operations that has to be done when using large primes, not sure if the `big-number` library can handle these.

If this is indeed the problem, a solution could be to create or find an inifite-numbers calculator.

## Useful links

https://en.wikipedia.org/wiki/RSA_(cryptosystem)

https://en.wikipedia.org/wiki/List_of_prime_numbers

https://www.npmjs.com/package/big-number
