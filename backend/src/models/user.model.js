import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /\S+@\S+\.\S+/.test(value);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: { type: String, required: true },

    isVerified: { type: Boolean, default: false },
    isSetuped: { type: Boolean, default: false },

    verificationToken: { type: String, default: "" },
    verificationTokenExpires: { type: Date, default: null },

    profilePic: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },

    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
