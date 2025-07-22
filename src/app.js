import express from "express";
import cors from "cors";
import pdfRouter from "./routes/pdf.js";
import urlRouter from "./routes/url.js";
import historyRouter from "./routes/history.js";
import textRouter from "./routes/text.js";
import "./db/mongoose.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/pdf", pdfRouter);
app.use("/url", urlRouter);
app.use("/history", historyRouter);
app.use("/text", textRouter);
export default app;