import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  resetPasswordToken?: string | null;
  resetPasswordExpire?: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>(
    "User",
    UserSchema
  );

export default User;