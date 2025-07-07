import mongoose from "mongoose";

const ntaLogSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    requestPayload: Object,
    encryptedChunks: [String],
    response: Object,
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },
    sentAt: Date,
  },
  { timestamps: true }
);

const NTALog = mongoose.model("NTALog", ntaLogSchema);
export default NTALog;
