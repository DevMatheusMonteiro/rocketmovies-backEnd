import { Router } from "express";
import MovieTagsController from "../controllers/MovieTagsController.js";

const movieTagsRoutes = Router();
const movieTagsController = new MovieTagsController();

movieTagsRoutes.get("/", movieTagsController.index);
movieTagsRoutes.get("/:id", movieTagsController.show);
movieTagsRoutes.delete("/:id", movieTagsController.delete);
movieTagsRoutes.post("/:user_id", movieTagsController.create);
movieTagsRoutes.put("/:user_id", movieTagsController.update);

export default movieTagsRoutes;
