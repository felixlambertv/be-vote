import { checkJwt, requireRole } from "./../middleware/Auth.middleware";
import { UserController } from "./../controller/User.controller";
import { AuthController } from "./../controller/Auth.controller";
import express, { Request, Response, Router } from "express";
import { initDependency } from "../di/DependencyInjection";
import { Role } from "../enum/Role";
import { PollController } from "../controller/Poll.controller";

export default function bindRoutes(): Router {
  const { authController, userController, pollController } =
    initDependency() as {
      authController: AuthController;
      userController: UserController;
      pollController: PollController;
    };

  const healthRouter = express.Router();
  healthRouter.get("/health", (req: Request, res: Response) => {
    res.send("OK");
  });

  const authRouter = express.Router();
  authRouter.post("/auth/login", (req: Request, res: Response) => {
    authController.login(req, res);
  });

  const userRouter = express.Router();
  userRouter.post(
    "/users",
    checkJwt,
    requireRole(Role.ADMIN),
    (req: Request, res: Response) => {
      userController.createUser(req, res);
    }
  );
  userRouter.get(
    "/users",
    checkJwt,
    requireRole(Role.ADMIN),
    (req: Request, res: Response) => {
      userController.getAllUser(req, res);
    }
  );
  userRouter.get(
    "/users/:id",
    checkJwt,
    requireRole(Role.ADMIN),
    (req: Request, res: Response) => {
      userController.getUser(req, res);
    }
  );
  userRouter.patch(
    "/users/:id",
    checkJwt,
    requireRole(Role.ADMIN),
    (req: Request, res: Response) => {
      userController.updateUser(req, res);
    }
  );

  const pollRouter = express.Router();
  pollRouter.get("/polls", checkJwt, (req: Request, res: Response) => {
    pollController.getPollList(req, res);
  });
  pollRouter.post(
    "/polls",
    checkJwt,
    requireRole(Role.ADMIN),
    (req: Request, res: Response) => {
      pollController.createPoll(req, res);
    }
  );
  pollRouter.post(
    "/polls/:id/vote",
    checkJwt,
    requireRole(Role.USER),
    (req: Request, res: Response) => {
      pollController.addVote(req, res);
    }
  );

  const v1Router = express.Router();
  v1Router.use("/api/v1", healthRouter, userRouter, authRouter, pollRouter);
  return v1Router;
}
