# KeyCload-OIDC
Using OpenID-client to connect KeyCloak with Fastify App
Two main Algorithm used to hash the payload and the header of the JWT

### 1- HS256 Algorithm (Symatric: both parties must have the same password)

- **HS256**: Stands for HMAC with SHA-256. HMAC (Hash-based Message Authentication Code) is a specific type of message authentication code (MAC) involving a cryptographic hash function (in this case, SHA-256) and a secret cryptographic key.
- **SHA-256**: stands for **Secure Hash Algorithm 256-bit**. It is a cryptographic hash function that produces a fixed-size (256-bit) hash value from an input of any size. SHA-256 is part of the SHA-2 family of hash functions, which were designed by the National Security Agency (NSA) and published by the National Institute of Standards and Technology (NIST).

### Key Characteristics of SHA-256

- **Fixed Output Size**: SHA-256 always produces a 256-bit (32-byte) hash value, regardless of the size of the input.
- **Deterministic**: The same input will always produce the same hash value.
- **Fast Computation**: SHA-256 is designed to be fast to compute.
- **Pre-image Resistance**: It is computationally infeasible to reverse the hash function (i.e., to find the original input given the hash value).
- **Collision Resistance**: It is computationally infeasible to find two different inputs that produce the same hash value.
- **Avalanche Effect**: A small change in the input (even a single bit) will produce a significantly different hash value.

### JWT Issuer and Verifier

- **Issuer**: The entity that issues the JWT. In your case, this is Keycloak.
- **Verifier**: The entity that verifies the JWT. In your case, this is your Node.js application (Fastify).

### Shared Secret

- **Shared Secret**: Both the issuer (Keycloak) and the verifier (Fastify) must have the same secret string. This secret is used to hash the payload and header when creating the JWT and to verify the JWT when it is received.

### Example of HS256

#### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### Payload
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

#### Secret Key
```plaintext
your-256-bit-secret
```

### Signing Process

1. **Base64Url encode** the header and payload.
2. **Concatenate** the encoded header and payload with a period (`.`).
3. **Hash and Sign** the concatenated string using SHA-256 and the shared secret key.
4. **Append** the signature to the JWT.

### Verifying Process

1. **Base64Url decode** the header and payload.
2. **Concatenate** the decoded header and payload with a period (`.`).
3. **Hash** the concatenated string using SHA-256 and the shared secret key.
4. **Compare** the resulting hash with the signature in the JWT.

### Example Code for Signing and Verifying JWT with HS256

#### Signing JWT

```javascript
const jwt = require('jsonwebtoken');

// Define the payload
const payload = {
  sub: '1234567890',
  name: 'John Doe',
  iat: 1516239022
};

// Define the secret key
const secret = 'your-256-bit-secret';

// Sign the JWT
const token = jwt.sign(payload, secret, { algorithm: 'HS256' });

console.log('Signed JWT:', token);
```

#### Verifying JWT

```javascript
const jwt = require('jsonwebtoken');

// Define the secret key
const secret = 'your-256-bit-secret';

// JWT token to verify
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Verify JWT
jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, decoded) => {
  if (err) {
    console.error('JWT verification failed:', err);
  } else {
    console.log('JWT verified successfully:', decoded);
  }
});
```

### Summary

- **HS256**: Uses a shared secret key to sign the JWT. Both the issuer (Keycloak) and verifier (Fastify) must have the same secret key.
- **Issuer**: The entity that issues the JWT (Keycloak).
- **Verifier**: The entity that verifies the JWT (Fastify).

By using the same secret key, Keycloak can sign the JWT, and Fastify can verify the JWT to ensure its integrity and authenticity.


----------------------


Let's clarify the RS256 algorithm and how it works in the context of JWTs. RS256 is an asymmetric algorithm, which means it uses a pair of keys: a private key and a public key.

### 2- RS256 Algorithm (Asymmetric)

- **RS256**: Stands for RSA Signature with SHA-256. It uses the RSA algorithm to sign the JWT with a private key and verify it with a public key.
- **Asymmetric**: The issuer (Keycloak) has the private key, and the verifier (Fastify) has the public key.

### JWT Issuer and Verifier

- **Issuer**: The entity that issues the JWT. In your case, this is Keycloak.
- **Verifier**: The entity that verifies the JWT. In your case, this is your Node.js application (Fastify).

### Key Pair

- **Private Key**: Used by the issuer (Keycloak) to sign the JWT. This key is kept secret and is not shared.
- **Public Key**: Used by the verifier (Fastify) to verify the JWT. This key is shared publicly and can be used by anyone to verify the JWT.

### Signing Process with RS256

1. **Base64Url encode** the header and payload.
2. **Concatenate** the encoded header and payload with a period (`.`).
3. **Hash** the concatenated string using SHA-256.
4. **Sign** the hash with the private key using the RSA algorithm.
5. **Append** the signature to the JWT.

### Step 4: Sign the Hash with the Private Key Using the RSA Algorithm

#### Detailed Explanation

- **Hashing**: The concatenated header and payload are hashed using SHA-256. This produces a fixed-size (256-bit) hash value.
- **Signing**: The hash value is then signed using the RSA algorithm with the private key. This involves encrypting the hash value with the private key.

#### What Happens During Signing?

1. **Hashing**: The concatenated string (header + payload) is hashed using SHA-256.
   - Example: `c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31f7b3e76`
2. **Signing**: The hash value is encrypted with the private key using the RSA algorithm. This produces the signature.
   - The signature is a cryptographic proof that the JWT was created by the holder of the private key.


### Verifying Process with RS256

1. **Base64Url decode** the header and payload.
2. **Concatenate** the decoded header and payload with a period (`.`).
3. **Hash** the concatenated string using SHA-256.
4. **Verify** the hash with the public key using the RSA algorithm.
5. **Compare** the resulting hash with the signature in the JWT.

### Step 4: Verify the Hash with the Public Key Using the RSA Algorithm

#### Detailed Explanation

- **Hashing**: The concatenated header and payload are hashed using SHA-256. This produces a fixed-size (256-bit) hash value.
- **Verification**: The signature is decrypted using the public key. The decrypted value should match the hash value of the concatenated header and payload.

#### What Happens During Verification?

1. **Hashing**: The concatenated string (header + payload) is hashed using SHA-256.
   - Example: `c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31f7b3e76`
2. **Verification**: The signature is decrypted using the public key. If the decrypted value matches the hash value, the JWT is verified.
   - The public key is used to decrypt the signature. If the decrypted value matches the hash of the concatenated header and payload, it proves that the JWT was signed by the holder of the private key.

### Example of RS256

#### Header
```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

#### Payload
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

#### Private Key (for signing)
```plaintext
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASC...
-----END PRIVATE KEY-----
```

#### Public Key (for verification)
```plaintext
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...
-----END PUBLIC KEY-----
```

### Signing JWT with RS256

Here's an example of how to sign a JWT using RS256 in Node.js:

```javascript
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Load private key
const privateKey = fs.readFileSync('private_key.pem', 'utf8');

// Define the payload
const payload = {
  sub: '1234567890',
  name: 'John Doe',
  iat: 1516239022
};

// Sign the JWT
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

console.log('Signed JWT:', token);
```

### Verifying JWT with RS256

Here's an example of how to verify a JWT using RS256 in Node.js:

```javascript
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Load public key
const publicKey = fs.readFileSync('public_key.pem', 'utf8');

// JWT token to verify
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.i0Kfn3WnPo2NgkCTep-aEskopMYewzoCBzIPm0Tbtqi-S3ytq0w5Wiju0e-m5jHfB06ZN0J_2WGT14Ri2sjQbZaph2TqLShP6ftJ5RM45sEGIHwYKncnRY9tzK-df9z3bW-xr8K5mXVaxp3fUbX9TqziugrkY__zorI_AiXVROQ_pgXTT6Q0bc2BhnAeym2ulpRDZO0HD0iinhMefrJdiOAqlnczsqAnHBdOJYu_9ew67gMnpF5ICmX244XodxGxLBFkY8U6uBLUJR13YMZvPjHcwVrSiA7pJ6Im2GJD_8v2-LM6tQJO_YqG-JVjJDedJquYPHJR6JJZaPl76LxgZQ';

// Verify JWT
jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
  if (err) {
    console.error('JWT verification failed:', err);
  } else {
    console.log('JWT verified successfully:', decoded);
  }
});
```

### Summary

- **RS256**: Uses a private key to sign the JWT and a public key to verify it. The private key is kept secret by the issuer (Keycloak), while the public key is shared with the verifier (Fastify).
- **Issuer**: The entity that issues the JWT (Keycloak).
- **Verifier**: The entity that verifies the JWT (Fastify).
- **Signature**: The signature is created by hashing the concatenated header and payload with SHA-256 and signing it with the private key using the RSA algorithm. The public key is used to verify the signature.

In the case of RS256, the JWT itself does not contain the public key. The public key is shared separately and used by the verifier to verify the signature. The signature part of the JWT includes the hashed header and payload, signed with the private key. The verifier uses the public key to verify that the signature is valid and that the token has not been tampered with.

{
  "e": "AQAB",
  "kty": "RSA",
  "n": "nFAVWfkVJpbN143mkDCHV-Le0VrQiirqdD59IKpXkS8yZCngapiSCjk4QHApnuoA131QfB01PfAVqtZByLKCXnngSdNyf9z4dR3N0wozXe2wkhU2XXgTI9GKbcQU79MLhH_dg63Yjry--ATj7XEgt_xQU1f_yeddXFNqKdfzCmXJhKrYqxzDKOW1PJY-i3WdBdHqBxlqxQArnMn3SpBKFbeSw3gOk3RD4guAxF902QnethR-JMbFUYioJkQm9r-2N8bwsyxjm2ENjYAeezWunN-BbK9I-rWGvMi8XsFl0eKgiERq4TAOoA4QMYiPqypn7CeQDltueCf5zVeGJMsllQ"
}
