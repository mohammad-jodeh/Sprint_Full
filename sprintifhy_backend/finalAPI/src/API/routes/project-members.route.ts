import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { ProjectMembersController } from "../controllers/project-member.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { restrictTo } from "../middlewares/permissions.middleware";
import { ProjectPermission } from "../../domain/types";
import { Token } from "../enums/token";

export class ProjectMembersRoutes extends BaseRoute {
  public path: string = "/:projectId/members";

  protected initRoutes(): void {
    const controller = container.resolve(ProjectMembersController);

    this.router.post(
      "",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR), // anyone with MODERATOR or higher can add members
      controller.add.bind(controller)
    );

    this.router.patch(
      "",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.update.bind(controller)
    );

    this.router.delete(
      "/:membershipId",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.remove.bind(controller)
    );

    this.router.get(
      "",
      authenticate,
      restrictTokens(Token.ACCESS),
      controller.get.bind(controller)
    );
  }
}
