import crypto from "crypto";

export default {
  jwt: {
    secret: process.env.AUTH_SECRET || crypto.randomBytes(32).toString("hex"),
    expiresIn: "1d",
  },
};
