const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
 
  verifyToken:{ type: String, required: true },

    
  },
  {
    versionKey: false,
  }
);

const VerifyTokenModel = new mongoose.model("verifyToken", userSchema);

module.exports = { VerifyTokenModel };
