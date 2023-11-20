import { Router } from "express";
import usersRoutes from "./users.routes.js";
import movieNotesRoutes from "./movieNotes.routes.js";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/movie-notes", movieNotesRoutes);

export default routes;
