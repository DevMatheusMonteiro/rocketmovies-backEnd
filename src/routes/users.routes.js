import { Router } from "express";
import UsersController from "../controllers/UsersController.js";
import UsersAvatarController from "../controllers/UsersAvatarController.js";
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";
import multer from "multer";
import * as upload from "../configs/upload.js";

const usersRoutes = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();
const uploadConfig = multer(upload.MULTER);

usersRoutes.post("/", usersController.create);
usersRoutes.get("/", ensureAuthenticated, usersController.show);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  uploadConfig.single("avatar"),
  usersAvatarController.update
);

export default usersRoutes;
