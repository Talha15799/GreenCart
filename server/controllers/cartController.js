import User from "../models/user.js";

// update User CartData: /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const userId = req.userId; // Get userId from authenticated user
    
    if (!userId) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "Cart Updated" });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
