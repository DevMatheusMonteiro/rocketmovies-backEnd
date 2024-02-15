import { Router } from "express";
import MovieTagsController from "../controllers/MovieTagsController.js";
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";

const movieTagsRoutes = Router();
const movieTagsController = new MovieTagsController();

movieTagsRoutes.use(ensureAuthenticated);

movieTagsRoutes.get("/", movieTagsController.index);
movieTagsRoutes.get("/:id", movieTagsController.show);
movieTagsRoutes.delete("/:id", movieTagsController.delete);
movieTagsRoutes.post("/", movieTagsController.create);
movieTagsRoutes.put("/:id", movieTagsController.update);

export default movieTagsRoutes;
