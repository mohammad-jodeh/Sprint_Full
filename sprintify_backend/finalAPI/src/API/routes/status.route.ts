import { container } from "tsyringe";
import { StatusController } from "../controllers/status.controller";
import { BaseRoute } from "./base.route";
import { ProjectPermission } from "../../domain/types";
import { Token } from "../enums/token";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTo } from "../middlewares/permissions.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";

export class StatusRoutes extends BaseRoute {
  public path = "/:projectId/status";

  protected initRoutes(): void {
    const controller = container.resolve(StatusController);

    this.router.post(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.create.bind(controller)
    );

    this.router.patch(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.update.bind(controller)
    );

    this.router.delete(
      "/:id",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.delete.bind(controller)
    );

    this.router.get(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      controller.find.bind(controller)
    );
  }
}
