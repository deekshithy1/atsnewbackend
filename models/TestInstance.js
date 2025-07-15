
import mongoose from "mongoose";

// Define the reusable visualTestSchema
const visualTestSchema = new mongoose.Schema({
  isPassed: { type: Boolean, default: false },
  remarks: { type: String },
  status: {
    type: String,
    enum: ["Pending", "completed"],
    default: "Pending",
  },
}, { _id: false });

// Main TestInstance schema
const testInstanceSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
    unique: true,
  },
  visualTests: {
    rule189_3i: visualTestSchema,
    rule189_7_Visual: visualTestSchema,
    rule189_8a: visualTestSchema,
    rule189_8b: visualTestSchema,
    rule189_9a: visualTestSchema,
    rule189_9b: visualTestSchema,
    rule189_10: visualTestSchema,
    rule189_11a: visualTestSchema,
    rule189_11b: visualTestSchema,
    rule189_11c: visualTestSchema,
    rule189_11d: visualTestSchema,
    rule189_11e: visualTestSchema,
    rule189_12a: visualTestSchema,
    rule189_12b: visualTestSchema,
    rule189_12a_Visual: visualTestSchema,
    rule189_12b_Visual: visualTestSchema,
    rule189_13: visualTestSchema,
    rule189_14: visualTestSchema,
    rule189_15: visualTestSchema,
    rule189_16_Visual: visualTestSchema,
    rule189_17a: visualTestSchema,
    rule189_17b: visualTestSchema,
    rule189_19: visualTestSchema,
    rule189_20: visualTestSchema,
    rule189_22: visualTestSchema,
    rule189_23: visualTestSchema,
    rule189_24: visualTestSchema,
    rule189_25: visualTestSchema,
    rule189_26: visualTestSchema,
    rule189_27: visualTestSchema,
    rule189_27_Visual: visualTestSchema,
    rule189_28: visualTestSchema,
    rule189_29: visualTestSchema,
    rule189_30: visualTestSchema,
    rule189_31_Visual: visualTestSchema,
    rule189_32: visualTestSchema,
    rule189_33: visualTestSchema,
    rule189_34: visualTestSchema,
    rule189_34_Visual: visualTestSchema,
    rule189_35a: visualTestSchema,
    rule189_35b: visualTestSchema,
    rule189_35c: visualTestSchema,
    rule189_35d: visualTestSchema,
    rule189_36: visualTestSchema,
    rule189_37_Visual: visualTestSchema,
    rule189_38: visualTestSchema,
    rule189_39: visualTestSchema,

    // Photo proofs
    imgFront: visualTestSchema,
    imgLeft: visualTestSchema,
    imgRight: visualTestSchema,
    imgEngine: visualTestSchema,
    imgChassis: visualTestSchema,
  },
  functionalTests: Object,
  status: {
    type: String,
    enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
    default: "PENDING",
  },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });


// ✅ Pre-validate hook to initialize missing visualTests keys
testInstanceSchema.pre("validate", function (next) {
  const visualTestKeys = [
    "rule189_3i", "rule189_7_Visual", "rule189_8a", "rule189_8b",
    "rule189_9a", "rule189_9b", "rule189_10", "rule189_11a",
    "rule189_11b", "rule189_11c", "rule189_11d", "rule189_11e",
    "rule189_12a", "rule189_12b", "rule189_12a_Visual", "rule189_12b_Visual",
    "rule189_13", "rule189_14", "rule189_15", "rule189_16_Visual",
    "rule189_17a", "rule189_17b", "rule189_19", "rule189_20",
    "rule189_22", "rule189_23", "rule189_24", "rule189_25",
    "rule189_26", "rule189_27", "rule189_27_Visual", "rule189_28",
    "rule189_29", "rule189_30", "rule189_31_Visual", "rule189_32",
    "rule189_33", "rule189_34", "rule189_34_Visual", "rule189_35a",
    "rule189_35b", "rule189_35c", "rule189_35d", "rule189_36",
    "rule189_37_Visual", "rule189_38", "rule189_39",
    "imgFront", "imgLeft", "imgRight", "imgEngine", "imgChassis"
  ];

  if (!this.visualTests) this.visualTests = {};

  visualTestKeys.forEach(key => {
    if (!this.visualTests[key]) {
      this.visualTests[key] = {};  
    }
  });

  next();
});

// Export the model
const TestInstance = mongoose.model("TestInstance", testInstanceSchema);
export default TestInstance;
