import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, movieTags } = request.body;

    const user_id = request.user.id;

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

    if (rating < 0 || rating > 5) {
      throw new AppError("Nota deve ser de 0 a 5");
    }

    const [movie_note_id] = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id,
    });

    if (movieTags.length > 0) {
      const tagsInsert = movieTags.map((tags) => {
        return {
          movie_note_id,
          user_id,
          name: tags,
        };
      });

      await knex("movieTags").insert(tagsInsert);
    }

    return response.status(201).json();
  }

  async update(request, response) {
    const { title, description, rating } = request.body;

    const user_id = request.user.id;

    const { id } = request.params;

    const [movieNotes] = await knex("movieNotes")
      .select()
      .where({ id, user_id });

    if (title) {
      const [movieNotesWithUpdatedTitle] = await knex("movieNotes")
        .select()
        .where({ title, user_id, id });

      if (
        movieNotesWithUpdatedTitle &&
        movieNotesWithUpdatedTitle.id !== movieNotes.id
      ) {
        throw new AppError("Já há uma anotação de filme com esse título!");
      }
    }

    if (rating < 0 || rating > 5) {
      throw new AppError("Nota deve ser de 0 a 5");
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
    const { title, movieTags } = request.query;

    const user_id = request.user.id;

    let movieNotes;

    if (movieTags) {
      const filterMovieTags = movieTags.split(",").map((tag) => tag.trim());

      movieNotes = await knex("movieNotes")
        .select(
          "movieNotes.id",
          "movieNotes.title",
          "movieNotes.description",
          "movieNotes.rating",
          "movieNotes.user_id"
        )
        .distinct("movieNotes.id")
        .where("movieNotes.user_id", user_id)
        .whereLike("movieNotes.title", `%${title}%`)
        .whereIn("movieTags.name", filterMovieTags)
        .innerJoin("movieTags", "movieNotes.id", "movieTags.movie_note_id")
        .orderBy("movieNotes.rating", "desc");
    } else {
      movieNotes = await knex("movieNotes")
        .select("id", "title", "rating", "description", "user_id")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("rating", "desc");
    }

    const userTags = await knex("movieTags").where({ user_id });

    const movieNotesWithTags = movieNotes.map((movieNote) => {
      const movieNoteTags = userTags.filter((tag) => {
        return tag.movie_note_id === movieNote.id;
      });

      return {
        ...movieNote,
        movieTags: movieNoteTags,
      };
    });

    return response.status(200).json(movieNotesWithTags);
  }

  async show(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    const movieNote = await knex("movieNotes").where({ id, user_id }).first();

    if (!movieNote) {
      throw new AppError("Nenhuma anotação de filme encontrada!", 404);
    }

    const movieTags = await knex("movieTags")
      .where({ movie_note_id: id, user_id })
      .orderBy("name");

    return response.status(200).json({
      ...movieNote,
      movieTags,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    const user_id = request.user.id;

    const movieNote = await knex("movieNotes").where({ id, user_id }).delete();

    if (!movieNote) {
      throw new AppError("Nenhuma anotação de filme encontrada!");
    }

    return response.status(200).json();
  }
}
