const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Admin = require("./models/admin");
const Role = require("./models/Role");
const Permission = require("./models/permission"); // If permissions are in a separate schema

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = "Admin@petalpureoasis.com";
    const password = "Admin@1234";

    // ✅ Step 1: Check if "admin" role exists
    let adminRole = await Role.findOne({ name: "admin" });

    if (!adminRole) {
      // ✅ Step 2: Create it if missing with all permissions
      const allPermissions = await Permission.find(); // Load all permissions

      adminRole = await Role.create({
        name: "admin",
        description: "System Admin with all access",
        permissions: allPermissions.map((perm) => perm._id),
      });

      console.log("✅ 'admin' role created with full permissions.");
    }

    // ✅ Step 3: Create or update admin user
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.findOneAndUpdate(
      { email },
      {
        email,
        password: hashedPassword,
        role: adminRole._id,
        isSuperAdmin: true, // Optional flag for future logic
      },
      { upsert: true, new: true }
    );

    console.log("✅ Admin created/updated successfully:", admin);
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error in createAdmin:", error);
    process.exit(1);
  }
};

createAdmin();
