import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    // تحقق من صحة التوكن
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = tokenDecode.id;

    // مرّر للـ route التالي
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token, login again",
      });
    }

    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
    
export default authUser;
