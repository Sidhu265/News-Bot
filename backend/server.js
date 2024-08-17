import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import colors from "colors";
import dotenv from "dotenv";
import { newsCallRoutes } from "./routes/newsRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1", newsCallRoutes);

const PORT = process.env.PORT || 8083;


app.get('/', (req, res) => {
    res.send('NewsBot API is running');
});


app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.DEV_MODE} mode on port no ${PORT}`.bgCyan
      .white
  );
});