import express from "express";
import { newsController } from "../Controllers/newsController.js";
const router = express.Router();
router.post('/news', newsController);
export {router as newsCallRoutes};