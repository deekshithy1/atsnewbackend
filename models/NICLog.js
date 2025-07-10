import mongoose from "mongoose";

const nicLogSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    requestPayload: Object,
    certificateStatus:String,
    certificateType:String,
    encryptedChunks: [String],
    response: Object,
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },
    sentAt: Date,
    validFrom:{type:Date},
    validTo:{type:Date},
  
  },
  { timestamps: true }
);

const NICLog = mongoose.model("NICLog", nicLogSchema); // ✅ Fix schema name here
export default NICLog;
