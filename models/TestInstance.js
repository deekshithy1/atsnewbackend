import mongoose from "mongoose";

const testInstanceSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      unique: true,
    },
    visualTests: Object,
    functionalTests: Object,
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
      default: "PENDING",
    },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const TestInstance = mongoose.model("TestInstance", testInstanceSchema);
export default TestInstance;
