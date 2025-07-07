// controllers/nicController.js
import asyncHandler from 'express-async-handler';
import Vehicle from '../models/Vehicle.js';
import TestInstance from '../models/TestInstance.js';
import NICLog from '../models/NICLog.js';

// @desc    Get all completed vehicles ready to be sent to NIC
// @route   GET /api/nic/ready
// @access  ATS_ADMIN
export const getVehiclesReadyForApproval = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({
    atsCenter: req.user.atsCenter,
    status: 'COMPLETED',
  });

  const approvedLogs = await NICLog.find({ status: 'SENT' }).select('bookingId');
  const sentBookingIds = approvedLogs.map(log => log.bookingId);

  const pendingVehicles = vehicles.filter(v => !sentBookingIds.includes(v.bookingId));

  res.json(pendingVehicles);
});




// @desc    Send approved vehicle data to NIC
// @route   POST /api/nic/send
// @access  ATS_ADMIN
export const sendToNIC = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const vehicle = await Vehicle.findOne({ bookingId }).populate('atsCenter');
  const test = await TestInstance.findOne({ bookingId });

  if (!vehicle || !test) {
    res.status(404);
    throw new Error('Vehicle or test instance not found');
  }

  const payload = {
    bookingId,
    registrationNumber: vehicle.regnNo,
    engineNumber: vehicle.engineNo,
    chassisNumber: vehicle.chassisNo,
    centerCode: vehicle.atsCenter.code,
    visualTests: test.visualTests,
    functionalTests: test.functionalTests,
    timestamp: new Date().toISOString(),
  };
  
  // TODO: the api call to NIC should be implemented here
  // For now, we will simulate the API call and response
  // Simulated POST request to NIC (replace with axios.post(...) for real)
  const fakeNICResponse = {
    status: 'SUCCESS',
    message: 'Data received by NIC',
  };

  await NICLog.create({
    bookingId,
    status: fakeNICResponse.status,
    response: fakeNICResponse,
  });

  // Update vehicle status to APPROVED
  vehicle.status = 'APPROVED';
  await vehicle.save();

  res.json({ message: 'Data sent to NIC successfully', response: fakeNICResponse });
});



// @desc    Get NIC log for a vehicle
// @route   GET /api/nic/log/:bookingId
// @access  ATS_ADMIN
export const getNICLogStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const log = await NICLog.findOne({ bookingId });

  if (!log) {
    res.status(404);
    throw new Error('No NIC log found for this booking ID');
  }

  res.json(log);
});
