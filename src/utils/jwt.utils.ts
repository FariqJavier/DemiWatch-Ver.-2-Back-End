import jwt from "jsonwebtoken";
import config from "config";
import dotenv from "dotenv";
dotenv.config();

// export function signJwt(
//   object: Object,
//   keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
//   options?: jwt.SignOptions | undefined
// ) {
//   const signingKey = Buffer.from(
//     config.get<string>(keyName),
//     "base64"
//   ).toString("ascii");

//   return jwt.sign(object, signingKey, {
//     ...(options && options),
//     algorithm: "RS256",
//   });
// }

export function signJwt(
  object: Object,
  keyName: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY",
  options?: jwt.SignOptions | undefined
) {
  const key = process.env[keyName];
  if (!key) {
    throw new Error(`Environment variable ${keyName} is not defined`);
  }
  const signingKey = Buffer.from(
    key,
    "base64"
  ).toString("ascii");

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt(
  token: string,
  keyName: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_TOKEN_PUBLIC_KEY"
) {
  const key = process.env[keyName];
  if (!key) {
    throw new Error(`Environment variable ${keyName} is not defined`);
  }
  const publicKey = Buffer.from(key, "base64").toString(
    "ascii"
  );

  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
