import { container } from "tsyringe";
import { BaseRoute } from "./base.route";
import { IssueController } from "../controllers/issue.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Router } from "express";
export class IssueRoutes extends BaseRoute {
  public path = "/:projectId/issues";

  constructor() {
    super();
    this.router = Router({ mergeParams: true });
    this.initRoutes(); 
  }

  protected initRoutes(): void {
    const controller = container.resolve(IssueController);
    this.router.post("/", authenticate, controller.create.bind(controller));

    this.router.get("/", authenticate, controller.getAll.bind(controller));  
    
    this.router.get("/:id", authenticate, controller.getById.bind(controller));

    this.router.patch("/:id", authenticate, controller.update.bind(controller));

    this.router.delete("/:id",authenticate,controller.delete.bind(controller));
  }
}
