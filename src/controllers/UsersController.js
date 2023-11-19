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

    const { id } = request.params;

    const { hash, compare } = bcryptjs;

    const user = await knex("users").first().where("users.id", id);

    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    if (!name && !email && !password) {
      throw new AppError("Nenhum valor informado para ser atualizado!");
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
      const samePassword = await compare(password, user.password);

      if (samePassword) {
        throw new AppError("A senha atual está igual a senha antiga!");
      }

      const checkPassword = await compare(old_password, user.password);

      if (!checkPassword) {
        throw new AppError("Senha antiga incorreta!");
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

    response.status(200).json();
  }
}
