import crypto from "crypto";

// a hashing function in built in Node.js
const hash256 = (data: string) => {
  // create an instance of crypto
  const hash = crypto.createHash(`sha256`);

  //   feed the data in
  hash.update(data);

  //   return the data
  return hash.digest(`hex`);
};

export { hash256 };
