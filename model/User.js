const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true, unique: true },
  role: { type: String, required: true, default: "user" },
  addresses: { type: [Schema.Types.Mixed] },
  // TODO: we can make a separate schema for this
  name: { type: String },
  orders: { Type: [Schema.Types.Mixed] },
  salt: { type: Buffer },
});

const virtual = UserSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model("User", UserSchema);
