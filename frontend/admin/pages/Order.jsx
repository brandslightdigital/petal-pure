// src/pages/admin/Orders.jsx
import React, { useEffect, useState } from "react";
import {useNavigate} from  "react-router-dom";
import { Table, Tag, Space, Typography, Card, Button } from "antd";
import { IndianRupee, Calendar, Search } from "lucide-react";
import axios from "axios";

const { Title, Text } = Typography;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Text copyable>{id.slice(-8)}</Text>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => (
        <div>
          <div>{customer.fullName}</div>
          <Text type="secondary">{customer.email}</Text>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <Space>
          <IndianRupee size={16} />
          <Text strong>{amount}</Text>
        </Space>
      ),
    },
    {
      title: "Payment ID",
      dataIndex: "razorpay_payment_id",
      key: "payment_id",
      render: (id) => <Text copyable>{id?.slice(-8) || "N/A"}</Text>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => (
        <Space>
          <Calendar size={16} />
          {new Date(date).toLocaleDateString()}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "orange"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/admin/dashboard/orders/${record._id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <Title level={3}>Orders</Title>
        <Button
          icon={<Search size={16} />}
          onClick={() => console.log("Implement search")}
        >
          Search
        </Button>
      </Space>

      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default OrdersPage;