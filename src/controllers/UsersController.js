import AppError from "../utils/AppError.js";
import knex from "../database/knex/index.js";
import bcryptjs from "bcryptjs";

export default class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex("users")
      .select(["users.email"])
      .where("users.email", email);

    if (checkUserExists.length > 0) {
      throw new AppError("Email já cadastrado!");
    }

    const { hash } = bcryptjs;

    const hashedPassWord = await hash(password, 8);

    await knex("users").insert({ name, email, password: hashedPassWord });

    return response.status(201).json();
  }
}
