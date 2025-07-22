import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["info-graphics", "concept-map", "visual-notes", "flash-cards", "key-points", "smart-summary", "media-carousels", "social-media-post"],
    required: true,
  },
  prompt: {
    type: String,
    default: "",
    required: false,
  },
  input: {
    type: String,
    default: "",
    required: false,
  },
  inputUrl: {
    type: String,
    default: "",
    required: false,
  },
  result: {
    type: String,
    default: "",
    required: false,
  },
  resultUrl: {
    type: [String],
    default: [],
    required: false,
  },
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

export default Item;
