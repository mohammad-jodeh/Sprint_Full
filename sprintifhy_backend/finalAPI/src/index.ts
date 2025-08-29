import "reflect-metadata";
import { AppDataSource } from "./infrastructure/database/data-source";
import { ensureDatabaseExists } from "./infrastructure/database/init-db";
import { registerDependencies } from "./infrastructure/database/container";
import { AppServer } from "./API";
import dotenv from "dotenv";
dotenv.config();
(async () => {
  await registerDependencies();
  await ensureDatabaseExists({
    dbName: "sprintify",
    user: "postgres",
    password: process.env.DB_PASSWORD as string,
  });

  await AppDataSource.initialize();
  console.success("📦 DB connected & schema synced");

  const API = new AppServer();
  API.listen(4000);
})();
