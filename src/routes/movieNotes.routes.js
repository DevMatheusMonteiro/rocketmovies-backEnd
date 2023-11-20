import { Router } from "express";
import MovieNotesController from "../controllers/MovieNotesController.js";

const movieNotesRoutes = Router();
const movieNotesController = new MovieNotesController();

movieNotesRoutes.post("/:user_id", movieNotesController.create);
movieNotesRoutes.put("/:id", movieNotesController.update);

export default movieNotesRoutes;
