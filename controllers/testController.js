import asyncHandler from "express-async-handler";
import TestInstance from "../models/TestInstance.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

// @desc Start test instance
// @route POST /api/test/start
// @access Technician
export const startTestInstance = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const vehicle = await Vehicle.findOne({ bookingId });

  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const existing = await TestInstance.findOne({ bookingId });
  if (existing) {
    res.status(400);
    throw new Error("Test instance already exists");
  }

  const testInstance = await TestInstance.create({
    bookingId,
    vehicle: vehicle._id,
    status: "IN_PROGRESS",
    submittedBy: req.user._id,
  });

  vehicle.status = "IN_PROGRESS";
  await vehicle.save();

  res.status(201).json(testInstance);
});



// @desc Submit test result (visual or functional)
// @route POST /api/test/submit
// @access Technician
export const submitTestResult = asyncHandler(async (req, res) => {
  const { bookingId, visualTests, functionalTests } = req.body;

  const testInstance = await TestInstance.findOne({ bookingId });

  if (!testInstance) {
    res.status(404);
    throw new Error("Test instance not found");
  }

  if (visualTests) {
    testInstance.visualTests = { ...testInstance.visualTests, ...visualTests };
  }

  if (functionalTests) {
    testInstance.functionalTests = {
      ...testInstance.functionalTests,
      ...functionalTests,
    };
  }

  await testInstance.save();

  res
    .status(200)
    .json({ message: "Test result updated", status: testInstance.status });
});

// @desc Get test status by bookingId
// @route GET /api/test/:bookingId/status
// @access Private
export const getTestStatusByBookingId = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const testInstance = await TestInstance.findOne({ bookingId }).populate(
    "submittedBy",
    "name role"
  );

  if (!testInstance) {
    res.status(404);
    throw new Error("Test instance not found");
  }

  res.json({
    bookingId: testInstance.bookingId,
    status: testInstance.status,
    visualTests: testInstance.visualTests || {},
    functionalTests: testInstance.functionalTests || {},
    submittedBy: testInstance.submittedBy || null,
  });
});

// @desc Get all test instances by technician's center
// @route GET /api/test/center/all
// @access ATS_ADMIN
export const getTestInstancesByCenter = asyncHandler(async (req, res) => {
  const atsCenterId = req.user.atsCenter;

  const vehicles = await Vehicle.find({ atsCenter: atsCenterId }).select("_id");

  const testInstances = await TestInstance.find({
    vehicle: { $in: vehicles.map((v) => v._id) },
  })
    .populate("vehicle", "regnNo bookingId status")
    .populate("submittedBy", "name role");

  res.json(testInstances);
});



// @desc Mark test as complete (manual trigger)
// @route POST /api/test/complete
// @access Technician
export const markTestAsComplete = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const testInstance = await TestInstance.findOne({ bookingId });

  if (!testInstance) {
    res.status(404);
    throw new Error('Test instance not found');
  }

  const isVisualDone = testInstance.visualTests && Object.keys(testInstance.visualTests).length > 0;
  const isFunctionalDone = testInstance.functionalTests && Object.keys(testInstance.functionalTests).length > 0;

  if (!isVisualDone || !isFunctionalDone) {
    res.status(400);
    throw new Error('Both visual and functional tests must be submitted before completion.');
  }

  testInstance.status = 'COMPLETED';
  await testInstance.save();

  const vehicle = await Vehicle.findOne({ bookingId });
  if (vehicle) {
    vehicle.status = 'COMPLETED';
    vehicle.laneExitTime = new Date();
    await vehicle.save();
  }

  res.json({ message: 'Test marked as completed successfully.' });
});
export const submitTest = asyncHandler(async (req, res) => {
  const bookingId = req.params.id
  const { rule, status, image } = req.body

  if (!bookingId || !rule) {
    return res.status(400).json({ message: "rule and bookingId are required" })
  }

  const update = image
    ? { $set: { [`visualTests.${rule}.Image`]: image } }
    : {
        $set: {
          [`visualTests.${rule}.isPassed`]: status === "true",
          [`visualTests.${rule}.remarks`]: status === "true" ? "PASSED" : "FAILED",
          [`visualTests.${rule}.status`]: "COMPLETED"
        }
      }

  const updated = await TestInstance.findOneAndUpdate({ bookingId }, update, { new: true })

  if (!updated) {
    return res.status(404).json({ message: "TestInstance not found" })
  }

  res.json({
    message: image
      ? `Image uploaded for ${rule}`
      : `Test ${rule} updated to ${status === "true" ? "PASSED" : "FAILED"}`,
    visualTest: updated.visualTests[rule]
  })
})

export const getVisualTest = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;

  if (!bookingId) {
    return res.status(400).json({ message: "bookingId is required" });
  }

  // findOne returns a single document
  const testInstance = await TestInstance.findOne({ bookingId });

  if (!testInstance) {
    return res.status(404).json({ message: "TestInstance not found" });
  }
  const testInstances=testInstance.visualTests
  res.json(testInstances);
});

// @desc Upload visual test image as Base64
// @route POST /api/tests/:id/upload-image
// @access Technician/Admin


export const uploadVisualImage = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const { rule, base64Image } = req.body;

  if (!rule || !base64Image) {
    return res.status(400).json({ message: "rule and base64Image are required" });
  }

  const testInstance = await TestInstance.findOne({ bookingId });
  if (!testInstance) {
    return res.status(404).json({ message: "TestInstance not found" });
  }

  // ✅ Save base64 image for the given rule
  testInstance.visualTests[rule] = {
    ...testInstance.visualTests[rule],
    Image: base64Image,
  };

  await testInstance.save();

  res.json({
    message: `Image uploaded for ${rule}`,
    visualTest: testInstance.visualTests[rule],
  });
});
