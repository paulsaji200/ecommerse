
import jwt from "jsonwebtoken"

const userAuth = (req, res, next) => {

    console.log("hello........")
    const token = req.cookies.token;
          console.log(token)
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }
  
    try {
      const decoded = jwt.verify(token, "secretKey");
      req.user = decoded;
      console.log(decoded)
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token is not valid" });
    }
  };







  export default userAuth