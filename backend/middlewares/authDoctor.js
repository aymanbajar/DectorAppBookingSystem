import jwt from "jsonwebtoken";

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const dtoken = req.headers.authorization?.split(" ")[1];

    if (!dtoken) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    // تحقق من صحة التوكن
    const tokenDecode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.body.docId = tokenDecode.id;

    // مرّر للـ route التالي
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
    
export default authDoctor;