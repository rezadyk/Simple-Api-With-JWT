const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
