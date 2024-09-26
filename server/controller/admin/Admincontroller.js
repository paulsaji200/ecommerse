
import adminData from "../../models/adminModel.js"

import { generateadminToken } from "../../utils/generateAdmintoken.js";
import jwt from "jsonwebtoken"

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const adminD = await adminData.findOne({ email: email });
  console.log(adminD);
  if (adminD) {
    if (password == adminD.password) {
     
      const { _id, name, email, isadmin} = adminD;

      generateadminToken(res, { _id, name, email, isadmin });

      res.status(201).send({ message: "successfully login" });
    } else {
      res.status(401).send({ message: "wrong password" });
    }
  } else {
    console.log("notfound");
    res.status(401).send({ message: "Email not found" });
  }
};
export const admintokenVerify = async (req, res) => {
  console.log("verify.....")
  const token = req.cookies.token;
  
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'secretKey');
    console.log(decoded)
    if (decoded.isadmin ) {
      res.json({ valid: true });
    } else {
      res.status(403).json({ valid: false, message: 'Not an admin' });
    }
  } catch (error) {
    console.log(error)
    
    res.status(400).json({ valid: false, message: 'Invalid token' });
  }
};




export default adminLogin;
