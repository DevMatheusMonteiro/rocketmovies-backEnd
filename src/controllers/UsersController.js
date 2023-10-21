import AppError from "../utils/AppError.js";

export default class UsersController {
  create(request, response) {
    const { name, email, password } = request.body;

    if (!name) {
      throw new AppError("Nome é obrigatório");
    }

    return response.status(201).json({ name, email, password });
  }
}
