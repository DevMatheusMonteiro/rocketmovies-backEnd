import AppError from "../utils/AppError.js";
import knex from "../database/knex/index.js";
import bcryptjs from "bcryptjs";

export default class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex("users")
      .first()
      .where("users.email", email);

    if (checkUserExists) {
      throw new AppError("Email já cadastrado!");
    }

    const { hash } = bcryptjs;

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({ name, email, password: hashedPassword });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;

    const { id } = request.user;

    const { hash, compare } = bcryptjs;

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    if (email) {
      const userUpdate = await knex("users")
        .first()
        .where("users.email", email);

      if (userUpdate && userUpdate.id !== user.id) {
        throw new AppError("Email já cadastrado!");
      }
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Informe a senha antiga!");
    }

    if (password && old_password) {
      const checkPassword = await compare(old_password, user.password);

      if (!checkPassword) {
        throw new AppError("Senha atual incorreta!");
      }

      const hashedPassword = await hash(password, 8);

      user.password = hashedPassword;
    }

    await knex("users")
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now(),
      })
      .where("users.id", user.id);

    return response.status(200).json();
  }

  async show(request, response) {
    const { id } = request.user;

    await knex("users").where({ id }).first();

    response.json();
  }
}
