import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardStats from "../admin/components/DashboardStats";
// import AdminContactEnquiries from "./pages/AdminContactEnquiry";
import AdminBlogs from "./pages/AdminBlogs";
import GlobalSettings from "./pages/AdminGlobalSetting";
import AdminProfile from "./pages/AdminProfile";
import OrdersPage from "./pages/Order";
import OrderDetailsPage from "./pages/OrderDetails";

const AppAdmin = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<DashboardPage />}>
          <Route index element={<DashboardStats />} />
          {/* <Route path="contact-enquiry" element={<AdminContactEnquiries />} /> */}
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="setting" element={<GlobalSettings />} />
          <Route path="Admin-profile" element={<AdminProfile />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailsPage />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppAdmin;
