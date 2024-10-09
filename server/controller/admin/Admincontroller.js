import adminData from "../../models/adminModel.js";
import Order from "../../models/order.js";
import jwt from "jsonwebtoken";
import { generateadminToken } from "../../utils/generateAdmintoken.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";


 const adminLogin = async (req, res) => {

  try {
    const { email, password } = req.body;
    console.log("Admin Login Request:", email, password);
  
    const adminD = await adminData.findOne({ email: email });
  
    if (adminD && password === adminD.password) {
      const { _id, name, email, isadmin } = adminD;
      generateadminToken(res, { _id, name, email, isadmin });
      return res.status(201).send({ message: "Successfully logged in" });
    }
    
    return res.status(401).send({ message: adminD ? "Wrong password" : "Email not found" });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).send({ message: "Server error" });
  }
};

// Admin token verification
export const admintokenVerify = async (req, res) => {
  const token = req.cookies?.token; // Use optional chaining to avoid potential errors
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, "secretKey");
    if (decoded.isadmin) {
      return res.json({ valid: true });
    }
    return res.status(403).json({ valid: false, message: "Not an admin" });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(400).json({ valid: false, message: "Invalid token" });
  }
};

// Sales report generation
export const salesReport = async (req, res) => {
  const { fromDate, toDate, filter } = req.query;

  try {
    const today = new Date();
    let startDate, endDate;

    if (!filter && !fromDate && !toDate) {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (filter === "Daily") {
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date(today.setHours(23, 59, 59, 999));
    } else if (filter === "Weekly") {
      const currentDayOfWeek = today.getDay();
      const startOfWeek = new Date(today.setDate(today.getDate() - currentDayOfWeek));
      startDate = new Date(startOfWeek.setHours(0, 0, 0, 0));
      endDate = new Date();
    } else if (filter === "Monthly") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
      startDate = fromDate ? new Date(fromDate) : new Date("1970-01-01");
      endDate = toDate ? new Date(toDate) : new Date();
    }

    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          productName: { $first: "$products.name" },
          totalQuantity: { $sum: "$products.quantity" },
          totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $addFields: {
          thumbnail: { $arrayElemAt: ["$productDetails.images", 0] },
          productBrand: { $arrayElemAt: ["$productDetails.brandName", 0] }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    const totalSummary = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      { $unwind: "$products" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
          totalQuantity: { $sum: "$products.quantity" }
        }
      }
    ]);

    res.status(200).json({
      topProducts: salesData,
      topProductsSummary: totalSummary[0] || { totalRevenue: 0, totalQuantity: 0 }
    });
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({ message: "Failed to generate sales report" });
  }
};


export const salesReportDownload = async (req, res) => {
  const { fromDate, toDate, filter, format } = req.query;

  try {
    // Set date range based on the filter
    let startDate, endDate;
    const today = new Date();

    if (!filter && !fromDate && !toDate) {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (filter === "Daily") {
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date(today.setHours(23, 59, 59, 999));
    } else if (filter === "Weekly") {
      const currentDayOfWeek = today.getDay();
      const startOfWeek = new Date(today.setDate(today.getDate() - currentDayOfWeek));
      startDate = new Date(startOfWeek.setHours(0, 0, 0, 0));
      endDate = new Date();
    } else if (filter === "Monthly") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
      startDate = fromDate ? new Date(fromDate) : new Date("1970-01-01");
      endDate = toDate ? new Date(toDate) : new Date();
    }

    // Fetch sales data within the date range
    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          productName: { $first: '$products.name' },
          totalQuantity: { $sum: '$products.quantity' },
          totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
        }
      }
    ]);

    if (format === "pdf") {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');
      doc.pipe(res);

      // Style: Add a header
      doc.fontSize(26).fillColor('#1E90FF').text("Sales Report", { align: "center" });
      doc.moveDown(0.5); // Spacing
      doc.fontSize(14).fillColor('#000000').text(`Report generated on: ${new Date().toLocaleDateString()}`, { align: "center" });
      doc.moveDown(2);

      // Style: Table headers
      doc.fontSize(14).fillColor('#FFFFFF').text("Product Name", 50, doc.y, { continued: true })
        .text("Quantity Sold", 250, doc.y, { continued: true })
        .text("Total Revenue", 400, doc.y);
      doc.moveDown(0.2);
      doc.rect(50, doc.y, 500, 0.5).fill('#000000'); // Line below headers

      // Style: Table data with alternating row colors
      let rowColor = false;
      salesData.forEach((item, index) => {
        const y = doc.y;
        rowColor = !rowColor;

        // Set alternating background color for rows
        doc.rect(50, y, 500, 20).fill(rowColor ? '#F0F8FF' : '#FFFFFF').stroke();

        // Add row data
        doc.fillColor('#000000').fontSize(12).text(item.productName, 50, y + 5, { continued: true })
          .text(item.totalQuantity, 250, y + 5, { continued: true })
          .text(item.totalRevenue.toFixed(2), 400, y + 5);
        doc.moveDown(0.5);
      });

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#808080').text('Generated by My Company', { align: 'center' });

      doc.end();
    } else if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sales Report");

      // Excel columns setup
      worksheet.columns = [
        { header: "Product Name", key: "productName", width: 30 },
        { header: "Total Quantity Sold", key: "totalQuantity", width: 20 },
        { header: "Total Revenue", key: "totalRevenue", width: 20 },
      ];

      // Add row data
      salesData.forEach((item) => {
        worksheet.addRow({
          productName: item.productName,
          totalQuantity: item.totalQuantity,
          totalRevenue: item.totalRevenue.toFixed(2),
        });
      });

      // Set headers for downloading the Excel file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="sales_report.xlsx"');

      // Write and end the response
      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.status(400).json({ message: "Invalid format" });
    }

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Failed to generate sales report' });
  }
};
export default adminLogin;
