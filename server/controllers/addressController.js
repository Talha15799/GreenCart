import Address from "../models/Address.js";
import mongoose from "mongoose";

export const addAddress = async (req, res) => {
  try {
    console.log("📩 Request body:", req.body); // Log the request body
    console.log("📩 Content-Type:", req.headers["content-type"]);

    const {
      userId,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
    } = req.body;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId format" });
    }

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !street ||
      !city ||
      !state ||
      !zipcode ||
      !country ||
      !phone
    ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newAddress = new Address({
      userId: new mongoose.Types.ObjectId(userId),
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode: Number(zipcode), // 👈 or keep as string if your schema prefers
      country,
      phone,
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: "✅ Address added successfully",
      data: newAddress,
    });
  } catch (error) {
    console.error("❌ Error in addAddress:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Addresses
export const getAddress = async (req, res) => {
  try {
    // Get userId from authenticated user (via authUser middleware)
    const userId = req.userId;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing userId" });
    }

    const addresses = await Address.find({ userId: new mongoose.Types.ObjectId(userId) });

    res.status(200).json({ success: true,addresses });
  } catch (error) {
    console.error("❌ Error fetching addresses:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid address ID format" });
    }

    const updatedAddress = await Address.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedAddress) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({
      success: true,
      message: "✅ Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("❌ Error updating address:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid address ID format" });
    }

    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, message: "✅ Address deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting address:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
