// src/pages/admin/Orders.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Space, Typography, Card, Button, message } from "antd";
import { IndianRupee, Calendar, Search } from "lucide-react";
import axios from "axios";

const { Title, Text } = Typography;

const INR = (n) =>
  Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const statusColor = (s = "") => {
  const x = s.toLowerCase();
  if (x === "paid" || x === "completed" || x === "success") return "green";
  if (x === "payment_failed" || x === "failed" || x === "refunded") return "red";
  if (x === "payment_created") return "blue";
  if (x === "details_submitted") return "orange";
  return "default";
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payment/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.success) {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } else {
        message.error(data?.message || "Failed to fetch orders");
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
      message.error(err?.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
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
      render: (id) =>
        id ? (
          <Text copyable={{ text: id }}>{id.slice(-8)}</Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => (
        <div>
          <div>{customer?.fullName || "—"}</div>
          <Text type="secondary">{customer?.email || "—"}</Text>
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
          <Text strong>{INR(amount)}</Text>
        </Space>
      ),
    },
    {
      title: "Payment ID",
      dataIndex: "razorpay_payment_id",
      key: "payment_id",
      render: (id) =>
        id ? <Text copyable>{id.slice(-8)}</Text> : <Text type="secondary">N/A</Text>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => (
        <Space>
          <Calendar size={16} />
          {date ? new Date(date).toLocaleString("en-IN") : "—"}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColor(status)}>{(status || "unknown").toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/admin/dashboard/orders/${record?._id}`)}
          disabled={!record?._id}
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
        <Button icon={<Search size={16} />} onClick={() => fetchOrders()}>
          Refresh
        </Button>
      </Space>

      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey={(r) => r?._id || r?.razorpay_payment_id || Math.random().toString(36).slice(2)}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>
    </div>
  );
}
