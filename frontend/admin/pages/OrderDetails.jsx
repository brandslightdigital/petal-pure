// src/pages/admin/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Descriptions,
  Tag,
  Typography,
  Card,
  Button,
  Space,
  Table,
  Image,
} from "antd";
import {
  IndianRupee,
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
} from "lucide-react";
import axios from "axios";

const { Title, Text } = Typography;

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payment/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(res.data.order);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  const itemsColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space>
          <Image
            width={50}
            src={record.image || "/default-product.jpg"}
            fallback="/default-product.jpg"
          />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Space>
          <IndianRupee size={14} />
          <Text>{price}</Text>
        </Space>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => (
        <Space>
          <IndianRupee size={14} />
          <Text strong>{(record.price * record.quantity).toFixed(2)}</Text>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeft size={16} />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Back to Orders
      </Button>

      <Title level={3}>Order Details</Title>

      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Card title="Order Summary">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Order ID">
              <Text copyable>{order._id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={order.status === "completed" ? "green" : "orange"}>
                {order.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              <Space>
                <Calendar size={16} />
                {new Date(order.createdAt).toLocaleString()}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              <Space>
                <IndianRupee size={16} />
                <Text strong>{order.amount}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Payment ID">
              <Text copyable>{order.razorpay_payment_id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Order ID (Razorpay)">
              <Text copyable>{order.razorpay_order_id}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title={<Space><User size={18} /> Customer Information</Space>}>
          <Descriptions bordered>
            <Descriptions.Item label="Name">
              {order.customer.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {order.customer.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {order.customer.phone}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title={<Space><MapPin size={18} /> Shipping Address</Space>}>
          <Text>
            {order.customer.address}
            <br />
            PIN: {order.customer.pincode}
          </Text>
        </Card>

        <Card title={<Space><Package size={18} /> Ordered Items</Space>}>
          <Table
            columns={itemsColumns}
            dataSource={order.cartItems}
            rowKey="name"
            pagination={false}
          />
        </Card>
      </Space>
    </div>
  );
};

export default OrderDetailsPage;