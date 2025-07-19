import mongoose from "mongoose";
import slugify from "slugify";

const diningSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    openHour: { type: String },
    location: { type: String, required: true },
    capacity: { type: String, required: true },
    phoneNumber: { type: String },
    images: {
      type: {
        url: { type: String },
        public_id: { type: String },
      },
      default: {
        url: "",
        public_id: "",
      },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

diningSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const diningModel = mongoose.model("dining", diningSchema);
export default diningModel;
