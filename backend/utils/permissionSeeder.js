// scripts/permissionSeeder.js
const mongoose = require("mongoose");
const Permission = require("../models/permission");

const MONGO_URI = "mongodb://127.0.0.1:27017/pench"; // ⛳ replace this

const seedPermissions = async () => {
  await mongoose.connect(MONGO_URI);
  const permissions = [
    { name: "dashboard", description: "Dashboard access" },
    { name: "blogs", description: "Manage blogs" },
    { name: "bookings", description: "View bookings" },
    { name: "user-manager", description: "User management" },
    { name: "role-manager", description: "Role management" },
    { name: "permission-manager", description: "Permission management" },
    { name: "enquiries", description: "Enquiry section" },
    { name: "contact-enquiry", description: "Contact form enquiries" },
    { name: "manager", description: "Hotel/Tour manager" },
    { name: "global-setting", description: "Access settings" }
  ];

  await Permission.deleteMany(); // Clear old
  await Permission.insertMany(permissions);

  console.log("✅ Permissions seeded");
  process.exit();
};

seedPermissions();
