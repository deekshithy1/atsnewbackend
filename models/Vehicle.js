import mongoose from "mongoose";


const vehicleSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    regnNo: { type: String, required: true },
    engineNo: { type: String, required: true },
    chassisNo: { type: String, required: true },
    atsCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ATSCenter",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "APPROVED"],
      default: "PENDING",
    },
    laneEntryTime: { type: Date },
    laneExitTime: { type: Date },
    photos: {
      imgFront: String,
      imgLeft: String,
      imgRight: String,
      imgEngine: String,
      imgChassis: String,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
