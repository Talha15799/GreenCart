import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const  token  = req.cookies.token;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔑 Decoded Token:", decoded); // 👈 debug check

    if (decoded.id) {
      req.userId = decoded.id; // ✅ use decoded.id
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized - Invalid token" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
