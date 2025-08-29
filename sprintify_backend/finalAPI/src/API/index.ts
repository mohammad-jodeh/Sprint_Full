import "./loggerOverwrite";
import "./types";
import express, { Application } from "express";
import { BaseRoute } from "./routes/base.route";
import { glob } from "glob";
import path from "path";
import swaggerUi from "swagger-ui-express";
import errorMiddleware from "./middlewares/error.middleware";
import { createServer, Server as HttpServer } from "http";
import { container } from "tsyringe";
import { SocketService } from "../infrastructure/socket/socket.service";
import cors from "cors";


export class AppServer {
  public app: Application;
  public httpServer: HttpServer;
  private readonly apiPrefix = "/api/v1";
  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.setupMiddleware();
    this.setupSocket(); // Initialize Socket.IO server
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "*", 
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
      })
    );

  }

  private async setupRoutes() {
    this.app.get("/health-check", (_, res) => {
      res.send({ status: "ok" });
    });

    const routeFiles = await glob(
      path.resolve(__dirname, "routes/*.ts").replace(/\\/g, "/")
    );

    for (const filePath of routeFiles) {
      const module = await import(filePath);
      for (const exportedName in module) {
        const RouteClass = module[exportedName];
        if (
          typeof RouteClass === "function" &&
          Object.getPrototypeOf(RouteClass).name === "BaseRoute"
        ) {
          const routeInstance: BaseRoute = new RouteClass();
          this.app.use(
            `${this.apiPrefix}${routeInstance.path}`,
            routeInstance.router
          );
          console.success(`Loaded route: ${routeInstance.path}`);
        }
      }
    }
  }
  private setupSocket(): void {
    const socketService = container.resolve<SocketService>("SocketService");
    socketService.initialize(this.httpServer);
  }

  public async listen(port: number): Promise<void> {
    await this.setupRoutes();
    //*this middleware cant be registered in setupMiddlewares because it needs to be the last middleware
    this.app.use(errorMiddleware);
    this.httpServer.listen(port, () =>
      console.info(`🚀 Server running at http://localhost:${port}`)
    );
  }
}
