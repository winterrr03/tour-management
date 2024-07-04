import { Express } from "express";
import { categoryRoutes } from "./category.route";
import { systemConfig } from "../../config/system";

const adminRoutes = (app: Express): void => {
  const path = `/${systemConfig.prefixAdmin}`;

  app.use(`${path}/categories`, categoryRoutes);
};

export default adminRoutes;
