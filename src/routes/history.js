import express from "express";
import Item from "../models/item.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const history = await Item.find();
  res.send(history);
});

router.get("/:id", async (req, res) => {
  const history = await Item.findById(req.params.id);
  res.send(history);
});


export default router;