import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
  },
  password: {
    type: String,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
});

const Users = mongoose.model("Users", userSchema);

export default Users;
