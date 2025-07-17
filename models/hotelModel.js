import mongoose from "mongoose";
import slugify from "slugify";

const hotelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    airConditioning: { type: String },
    wifi: { type: String },
    swimmingPool: { type: String },
    restaurant: { type: String },
    teaCoffeeMaker: { type: String },
    bathroomAmenities: { type: String },
    safe: { type: String },
    telephone: { type: String },
    maxOccupancy: { type: Number },
    bedType: { type: String },
    size: { type: String },
    images: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],
    featured: {
      type: String,
      default: false,
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

hotelSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
const hotelModel = mongoose.model("hotel", hotelSchema);
export default hotelModel;
