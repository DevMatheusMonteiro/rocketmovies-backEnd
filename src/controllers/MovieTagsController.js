import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class MovieTagsController {
  async create(request, response) {
    const { name } = request.body;

    const user_id = request.user.id;

    const { movie_note_id } = request.query;

    const [movieNotes] = await knex("movieNotes")
      .select()
      .where({ id: movie_note_id, user_id });

    if (!movieNotes) {
      throw new AppError("Nenhuma anotação de filme encontrada!");
    }

    const [checkMovieTagsExists] = await knex("movieTags")
      .select()
      .where({ movie_note_id, user_id, name });

    if (checkMovieTagsExists) {
      throw new AppError(
        `Já existe uma tag com o nome ${name} para essa anotação`
      );
    }

    await knex("movieTags").insert({ movie_note_id, user_id, name });
    await knex("movieNotes")
      .update({ updated_at: knex.fn.now() })
      .where({ id: movie_note_id });

    const movieTag = await knex("movieTags")
      .where({
        movie_note_id,
        user_id,
        name,
      })
      .first();

    return response.status(201).json(movieTag);
  }

  async update(request, response) {
    const { name } = request.body;

    const user_id = request.user.id;

    const { movie_note_id } = request.query;

    const { id } = request.params;

    const [movieNotes] = await knex("movieNotes")
      .select()
      .where({ id: movie_note_id, user_id });

    if (!movieNotes) {
      throw new AppError("Nenhuma anotação de filme encontrada!");
    }

    const [movieTags] = await knex("movieTags").select().where({ id });

    if (!movieTags) {
      throw new AppError("Tag não encontrada");
    }

    const [checkMovieTagName] = await knex("movieTags")
      .select()
      .where({ movie_note_id, user_id, name });

    if (checkMovieTagName && checkMovieTagName.id !== movieTags.id) {
      throw new AppError("Já existe uma tag com esse nome para essa anotação!");
    }

    await knex("movieTags").update({ name }).where({ id });

    await knex("movieNotes")
      .update({ updated_at: knex.fn.now() })
      .where({ id: movie_note_id });

    return response.status(200).json();
  }

  async index(request, response) {
    const user_id = request.user.id;

    const { movie_note_id } = request.query;

    const movieTags = await knex("movieTags").where({ user_id, movie_note_id });

    if (movieTags.length === 0) {
      throw new AppError("Nenhuma tag encontrada!");
    }

    return response.status(200).json(movieTags);
  }

  async show(request, response) {
    const { id } = request.params;

    const user_id = request.user.id;

    const movieTag = await knex("movieTags").where({ id, user_id }).first();

    if (!movieTag) {
      throw new AppError("Nenhuma tag encontrada!");
    }

    return response.status(200).json(movieTag);
  }

  async delete(request, response) {
    const { id } = request.params;

    const { movie_note_id } = request.query;

    const user_id = request.user.id;

    const movieTag = await knex("movieTags")
      .where({ id, user_id, movie_note_id })
      .delete();

    if (!movieTag) {
      throw new AppError("Nenhuma tag encontrada!");
    }

    await knex("movieNotes")
      .update({ updated_at: knex.fn.now() })
      .where({ id: movie_note_id });

    return response.status(200).json();
  }
}
