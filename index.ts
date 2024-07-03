import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/database";
import clientRoutes from "./routes/client/index.route";

sequelize;

const app: Express = express();
const port: number | string = `${process.env.PORT}` || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

clientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
