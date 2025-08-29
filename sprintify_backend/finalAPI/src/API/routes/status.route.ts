import { container } from "tsyringe";
import { StatusController } from "../controllers/status.controller";
import { BaseRoute } from "./base.route";
import { ProjectPermission } from "../../domain/types";
import { Token } from "../enums/token";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTo } from "../middlewares/permissions.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";

export class BoardColumnRoutes extends BaseRoute {
  public path = "/:projectId/status";

  protected initRoutes(): void {
    const controller = container.resolve(StatusController);

    this.router.use(
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR)
    );

    this.router.post("/", controller.create.bind(controller));

    this.router.patch("/", controller.update.bind(controller));

    this.router.delete("/:id", controller.delete.bind(controller));

    this.router.get("/", controller.find.bind(controller));
  }
}
