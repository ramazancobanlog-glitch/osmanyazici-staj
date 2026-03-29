import mongoose, { Schema, model, models } from "mongoose";

const NotebookSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true }, // For the "history" or technical details
    image: { type: String }, // Base64 string
    category: { type: String, default: "Standard" },
    historyYear: { type: Number }, // To show in a timeline
  },
  { timestamps: true }
);

const Notebook = models.Notebook || model("Notebook", NotebookSchema);

export default Notebook;
