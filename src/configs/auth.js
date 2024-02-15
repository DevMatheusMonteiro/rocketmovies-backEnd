import crypto from "crypto";

export default {
  jwt: {
    secret: crypto.randomBytes(32).toString("hex"),
    expiresIn: "1d",
  },
};
