import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, movieTags } = request.body;

    const { user_id } = request.params;

    const [checkUserExists] = await knex("users")
      .select()
      .where("users.id", user_id);

    if (!checkUserExists) {
      throw new AppError("Usuário não encontrado!");
    }

    const [checkMovieNotesExists] = await knex("movieNotes")
      .select()
      .where({ title: title, user_id: user_id });

    if (checkMovieNotesExists) {
      throw new AppError("Já há uma anotação de filme com esse título!");
    }

    if (rating < 1 || rating > 5) {
      throw new AppError("Nota deve ser de 1 a 5");
    }

    const [movie_note_id] = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = movieTags.map((tags) => {
      return {
        movie_note_id,
        user_id,
        name: tags,
      };
    });

    await knex("movieTags").insert(tagsInsert);

    return response.status(201).json();
  }

  async update(request, response) {
    const { title, description, rating } = request.body;

    const { user_id } = request.params;

    const { id } = request.query;

    const [movieNotes] = await knex("movieNotes")
      .select()
      .where({ id, user_id });

    if (!movieNotes) {
      throw new AppError("Anotação não encontrada!");
    }

    if (!title && !description && !rating) {
      throw new AppError("Nenhum valor informado para ser atualizado!");
    }

    if (title) {
      const [movieNotesWithUpdatedTitle] = await knex("movieNotes")
        .select()
        .where({ title, user_id });

      if (
        movieNotesWithUpdatedTitle &&
        movieNotesWithUpdatedTitle.id !== movieNotes.id
      ) {
        throw new AppError("Já há uma anotação de filme com esse título!");
      }
    }

    if (rating < 1 || rating > 5) {
      throw new AppError("Nota deve ser de 1 a 5");
    }

    movieNotes.title = title ?? movieNotes.title;
    movieNotes.description = description ?? movieNotes.description;
    movieNotes.rating = rating ?? movieNotes.rating;

    await knex("movieNotes")
      .update({
        title: movieNotes.title,
        description: movieNotes.description,
        rating: movieNotes.rating,
        updated_at: knex.fn.now(),
      })
      .where("movieNotes.id", movieNotes.id);

    return response.status(200).json();
  }

  async index(request, response) {
    const { user_id, title, movieTags } = request.query;

    let movieNotes;

    if (!title && !movieTags) {
      throw new AppError("Nenhum valor de pesquisa passado!");
    }

    if (movieTags) {
      const filterMovieTags = movieTags.split(",").map((tag) => tag.trim());

      movieNotes = await knex("movieNotes")
        .select(
          "movieNotes.id",
          "movieNotes.title",
          "movieNotes.rating",
          "movieNotes.user_id"
        )
        .distinct("movieNotes.id")
        .where("movieNotes.user_id", user_id)
        .whereLike("movieNotes.title", `%${title}%`)
        .whereIn("movieTags.name", filterMovieTags)
        .innerJoin("movieTags", "movieNotes.id", "movieTags.movie_note_id")
        .orderBy("movieNotes.rating");
    } else {
      movieNotes = await knex("movieNotes")
        .select("id", "title", "rating", "user_id")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("rating");
    }

    if (movieNotes.length === 0) {
      throw new AppError("Nenhuma anotação encontrada!");
    }

    const userTags = await knex("movieTags").where({ user_id });

    const movieNotesWithTags = movieNotes.map((movieNote) => {
      const movieNoteTags = userTags.filter((tag) => {
        return tag.movie_note_id === movieNote.id;
      });

      return {
        ...movieNote,
        tags: movieNoteTags,
      };
    });

    return response.status(200).json(movieNotesWithTags);
  }

  async show(request, response) {
    const { id } = request.params;
    const { user_id } = request.query;

    const movieNote = await knex("movieNotes").first().where({ id, user_id });

    const movieTags = await knex("movieTags")
      .where({ movie_note_id: id, user_id })
      .orderBy("name");

    if (!movieNote) {
      throw new AppError("Não Autorizado");
    }

    return response.status(200).json({
      ...movieNote,
      movieTags,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    const { user_id } = request.query;

    const movieNote = await knex("movieNotes").where({ id, user_id }).delete();

    if (!movieNote) {
      throw new AppError("Nenhuma anotação de filme encontrada!");
    }

    return response.status(200).json();
  }
}
