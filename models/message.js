const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Message = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type : Date, default: Date.now  },
});

Message.virtual('date').get(function() {
  return this.timestamp.toLocaleString();
});

// Virtual for message's URL
Message.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/message/${this._id}`;
});

// Export model
module.exports = mongoose.model("Message", Message);
