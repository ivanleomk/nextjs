import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: String,
});

module.exports =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
