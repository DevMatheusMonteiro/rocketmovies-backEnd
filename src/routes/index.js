import { Router } from "express";
import usersRoutes from "./users.routes.js";
import movieNotesRoutes from "./movieNotes.routes.js";
import movieTagsRoutes from "./movieTags.routes.js";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/movie-notes", movieNotesRoutes);
routes.use("/movie-tags", movieTagsRoutes);

export default routes;
