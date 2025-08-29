import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { SprintController } from "../controllers/sprint.controller";
import { IssueController } from "../controllers/issue.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { restrictTokens } from "../middlewares/tokenTypes.middleware";
import { restrictTo } from "../middlewares/permissions.middleware";
import { ProjectPermission } from "../../domain/types";
import { Token } from "../enums/token";

/**
 * Routes for sprint management
 */
export class SprintRoutes extends BaseRoute {
  public path = "/:projectId/sprints";

  /**
   * Initializes the sprint routes
   */
  protected initRoutes(): void {
    const controller = container.resolve(SprintController);
    const issueController = container.resolve(IssueController);

    // Create sprint
    this.router.post(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.create.bind(controller)
    );

    // Update sprint
    this.router.patch(
      "/:id",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.update.bind(controller)
    );

    // Delete sprint
    this.router.delete(
      "/:id",
      authenticate,
      restrictTokens(Token.ACCESS),
      restrictTo(ProjectPermission.MODERATOR),
      controller.delete.bind(controller)
    );

    // Get all sprints for project
    this.router.get(
      "/",
      authenticate,
      restrictTokens(Token.ACCESS),
      controller.find.bind(controller)
    );

    // Get sprint by ID
    this.router.get(
      "/:id",
      authenticate,
      restrictTokens(Token.ACCESS),
      controller.getById.bind(controller)
    );

    // Get issues for a specific sprint
    this.router.get(
      "/:id/issues",
      authenticate,
      restrictTokens(Token.ACCESS),
      issueController.getBySprint.bind(issueController)
    );
  }
}
