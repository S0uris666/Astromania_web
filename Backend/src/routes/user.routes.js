import { Router } from "express";
import multer from "multer";
import {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  verifyUser,
  adminGetAllUsers,
  adminPromoteUserToSuperuser,
  getPublishedUsers,
  getUserBySlug,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validator.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { authRol } from "../middlewares/authRol.js";

const userRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

userRouter.post("/register", validateSchema(registerSchema), createUser);
userRouter.post("/login", validateSchema(loginSchema), loginUser);
userRouter.post("/logout", logoutUser);
userRouter.put("/update", auth, upload.array("images", 6), updateUser);
userRouter.get("/verify-user", auth, verifyUser);

userRouter.get("/users/published", getPublishedUsers);
userRouter.get("/users/:slug", getUserBySlug);

userRouter.get("/admin/users", auth, authRol("admin"), adminGetAllUsers);
userRouter.post(
  "/admin/user/promote/:id",
  auth,
  authRol("admin"),
  adminPromoteUserToSuperuser
);

export default userRouter;
