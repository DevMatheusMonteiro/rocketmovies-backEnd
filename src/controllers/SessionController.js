import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../configs/auth.js";

export default class SessionController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email: email }).first();

    if (!user) {
      throw new AppError("Email e/ou senha incorretos", 401);
    }

    const { compare } = bcryptjs;

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new AppError("Email e/ou senha incorretos", 401);
    }

    const { secret, expiresIn } = auth.jwt;

    const token = jwt.sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    delete user.password;

    return response.json({ user, token });
  }
}
