export const up = (knex) =>
  knex.schema.createTable("movieTags", (table) => {
    table.increments("id");
    table
      .integer("movie_note_id")
      .references("id")
      .inTable("movieNotes")
      .onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");
    table.text("name");
  });

export const down = (knex) => knex.schema.dropTable("movieNotes");
