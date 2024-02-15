import { Router } from "express";
import usersRoutes from "./users.routes.js";
import movieNotesRoutes from "./movieNotes.routes.js";
import movieTagsRoutes from "./movieTags.routes.js";
import sessionRoutes from "./session.routes.js";

const routes = Router();

routes.use("/session", sessionRoutes);
routes.use("/users", usersRoutes);
routes.use("/movie-notes", movieNotesRoutes);
routes.use("/movie-tags", movieTagsRoutes);

export default routes;
