import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    //atoken = admin token
    const atoken = req.headers.authorization?.split(" ")[1];

    if (!atoken) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    // تحقق من صحة التوكن
    const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET);

    // تحقق إن البريد هو فعلاً admin
    if (tokenDecode.email !== process.env.ADMIN_EMAIL) {
      return res.json({
        success: false,
        message: "Not authorized, login again",
      });
    }

    // مرّر للـ route التالي
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
    
export default authAdmin;
