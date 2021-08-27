const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const refreshSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Refresh", refreshSchema);
