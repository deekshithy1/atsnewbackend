// controllers/nicController.js
import asyncHandler from "express-async-handler";
import Vehicle from "../models/Vehicle.js";
import TestInstance from "../models/TestInstance.js";
import NICLog from "../models/NICLog.js";



export const getVehiclesReadyForApproval = asyncHandler(async (req, res) => {
  // Step 1: Get completed vehicles from this ATS center
  const vehicles = await Vehicle.find({
    atsCenter: req.user.atsCenter,
    status: "COMPLETED",
  });

  // Step 2: Get already sent bookingIds
  const approvedLogs = await NICLog.find({ status: "SENT" }).select(
    "bookingId"
  );
  const sentBookingIds = approvedLogs.map((log) => log.bookingId);

  // Step 3: Filter out vehicles already sent
  const unsentVehicles = vehicles.filter(
    (v) => !sentBookingIds.includes(v.bookingId)
  );

  const bookingIds = unsentVehicles.map((v) => v.bookingId);

  // Step 4: Fetch TestInstances by bookingIds
  const testInstances = await TestInstance.find({
    bookingId: { $in: bookingIds },
  }).populate("submittedBy", "name email");

  // Step 5: Map test instances to bookingId
  const testMap = {};
  testInstances.forEach((test) => {
    if (!testMap[test.bookingId]) testMap[test.bookingId] = [];
    testMap[test.bookingId].push(test);
  });

  // Step 6: Attach testInstances to vehicles
  const response = unsentVehicles.map((vehicle) => {
    const vObj = vehicle.toObject(); // convert Mongoose doc to plain JS object
    vObj.testInstances = testMap[vehicle.bookingId] || [];
    return vObj;
  });

  res.json(response);
});

// @desc    Send approved vehicle data to NIC
// @route   POST /api/nic/send
// @access  ATS_ADMIN
export const sendToNIC = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
 
  const vehicle = await Vehicle.findOne({ bookingId }).populate("atsCenter");
  const test = await TestInstance.findOne({ bookingId });

  if (!vehicle || !test) {
    res.status(404);
    throw new Error("Vehicle or test instance not found");
  }

  const payload = {
    bookingId,
    registrationNumber: vehicle.regnNo,
    engineNumber: vehicle.engineNo,
    chassisNumber: vehicle.chassisNo,
    centerCode: vehicle.atsCenter.code,
    timestamp: new Date().toISOString(),
    
  };

  // TODO: the api call to NIC should be implemented here
  // For now, we will simulate the API call and response
  // Simulated POST request to NIC (replace with axios.post(...) for real)
  const fakeNICResponse = {
    status: "SENT",
    message: "Data received by NIC",
  };

  await NICLog.create({
    bookingId,
    vehicle: vehicle._id,
    status: fakeNICResponse.status,
    response: fakeNICResponse,
    certificateStatus:req.body.certificateStatus,
    certificateType:req.body.certificateType,
  
  });

  // Update vehicle status to APPROVED
  vehicle.status = "APPROVED";
  await vehicle.save();

  res.json({
    message: "Data sent to NIC successfully",
    response: fakeNICResponse,
  });
});

// @desc    Get NIC log for a vehicle
// @route   GET /api/nic/log/:bookingId
// @access  ATS_ADMIN
export const getNICLogStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const log = await NICLog.findOne({ bookingId });

  if (!log) {
    res.status(404);
    throw new Error("No NIC log found for this booking ID");
  }

  res.json(log);
});
export const getAllVehicles= asyncHandler(async(req,res)=>{
         const vehciles=await  NICLog.find();
     const vehicless=await  NICLog.find().populate('vehicle') 

         if(!vehciles){
          res.status(404);
          throw new Error("No vehcles")
         }
         res.json(vehicless);
})
