import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";
import DiskStorage from "../providers/DiskStorage.js";

export default class UsersAvatarController {
  async update(request, response) {
    const { id } = request.user;
    const avatarFilename = request.file.filename;

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError(
        "Somente usuário autenticados podem atualizar o avatar",
        401
      );
    }

    const diskStorage = new DiskStorage();

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);

    user.avatar = filename;

    await knex("users")
      .update({ avatar: user.avatar, updated_at: knex.fn.now() })
      .where({ id });

    return response.json({ avatar: user.avatar });
  }
}
