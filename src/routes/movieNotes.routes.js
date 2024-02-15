import { Router } from "express";
import MovieNotesController from "../controllers/MovieNotesController.js";
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";

const movieNotesRoutes = Router();
const movieNotesController = new MovieNotesController();

movieNotesRoutes.use(ensureAuthenticated);

movieNotesRoutes.get("/", movieNotesController.index);
movieNotesRoutes.get("/:id", movieNotesController.show);
movieNotesRoutes.delete("/:id", movieNotesController.delete);
movieNotesRoutes.post("/", movieNotesController.create);
movieNotesRoutes.put("/:id", movieNotesController.update);

export default movieNotesRoutes;
