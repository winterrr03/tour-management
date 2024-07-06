import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import moment from "moment";
import sequelize from "./config/database";
import clientRoutes from "./routes/client/index.route";
import bodyParser from "body-parser";
import { systemConfig } from "./config/system";
import adminRoutes from "./routes/admin/index.route";
import path from "path";

sequelize;

const app: Express = express();
const port: number | string = `${process.env.PORT}` || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.locals.moment = moment;
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End TinyMCE

adminRoutes(app);
clientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
