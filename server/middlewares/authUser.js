import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.id) {
      req.userId = decoded.id;
      next();
    } else {
      // Clear invalid token
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
      });
      return res.json({ success: false, message: "Not Authorized - Invalid token" });
    }
  } catch (error) {
    // Clear expired or invalid token
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    return res.json({ success: false, message: "Session expired. Please login again." });
  }
};

export default authUser;
