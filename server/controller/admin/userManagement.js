import Users from "../../models/userModel.js";

export const viewcustomer = async (req, res) => {
    console.log("hitted");
    try {
      const customers = await Users.find({});
      res.status(201).send({ data: customers });
    } catch {
      res.status(401);
    }
  };

export const userstatus = async (req, res) => {
  console.log("ll");
  try {
    const { id } = req.params;


    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    user.blocked = !user.blocked;


    await user.save();

    return res.status(200).json({
      message: `User ${user.blocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export default viewcustomer;
