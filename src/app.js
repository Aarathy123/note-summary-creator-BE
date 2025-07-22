import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes.js";
import urlRouter from "./routes/url.js";

import "./db/mongoose.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/notes", notesRouter);
app.use("/url", urlRouter);

export default app;