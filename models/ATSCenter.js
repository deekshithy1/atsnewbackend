import mongoose from "mongoose";



const centerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: { type: String, required: true },
    code: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    ipWhitelist: [String],
  },
  { timestamps: true }
);

const ATSCenter = mongoose.model("ATSCenter", centerSchema);
export default ATSCenter;
