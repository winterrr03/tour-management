import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import moment from "moment";
import sequelize from "./config/database";
import clientRoutes from "./routes/client/index.route";
import bodyParser from "body-parser";

sequelize;

const app: Express = express();
const port: number | string = `${process.env.PORT}` || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use(bodyParser.json());

app.locals.moment = moment;

clientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
