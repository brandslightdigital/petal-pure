import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Statistic, Spin, message } from "antd";
import { MessageCircle, Compass, Hotel, MapPin, PhoneCall } from "lucide-react";
import axios from "axios";
import { theme } from "antd";
const { useToken } = theme;

const DashboardCards = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    totalEnquiries: 0,
    safariEnquiries: 0,
    hotelEnquiries: 0,
    tourEnquiries: 0,
    contactEnquiries: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);

        const [safariRes, hotelRes, tourRes, contactRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/safarienquiry/`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/hotelenquiry`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/tour/tour-enquiries`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/contactenquiry/`),
        ]);

        setCounts({
          totalEnquiries:
            (safariRes.data?.enquiries?.length || 0) +
            (hotelRes.data?.length || 0) +
            (tourRes.data?.enquiries?.length || 0) +
            (contactRes.data?.contacts?.length || 0),
          safariEnquiries: safariRes.data?.enquiries?.length || 0,
          hotelEnquiries: hotelRes.data?.length || 0,
          tourEnquiries: tourRes.data?.enquiries?.length || 0,
          contactEnquiries: contactRes.data?.contacts?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
        message.error("Failed to load enquiry counts");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Card
          hoverable
          onClick={() => navigate("/admin/dashboard/enquiries")}
          style={{
            borderLeft: `4px solid ${token.colorPrimary}`,
            borderRadius: "8px",
          }}
        >
          <Statistic
            title="Total Enquiries"
            value={counts.totalEnquiries}
            valueStyle={{ color: token.colorPrimary, fontWeight: "bold" }}
            prefix={<MessageCircle size={24} color={token.colorPrimary} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Card
          hoverable
          onClick={() => navigate("/admin/dashboard/safari-enquiry")}
          style={{
            borderLeft: `4px solid ${token.colorSuccess}`,
            borderRadius: "8px",
          }}
        >
          <Statistic
            title="Safari Enquiries"
            value={counts.safariEnquiries}
            valueStyle={{ color: token.colorSuccess, fontWeight: "bold" }}
            prefix={<Compass size={24} color={token.colorSuccess} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Card
          hoverable
          onClick={() => navigate("/admin/dashboard/hotel-enquiry")}
          style={{
            borderLeft: `4px solid ${token.colorWarning}`,
            borderRadius: "8px",
          }}
        >
          <Statistic
            title="Hotel Enquiries"
            value={counts.hotelEnquiries}
            valueStyle={{ color: token.colorWarning, fontWeight: "bold" }}
            prefix={<Hotel size={24} color={token.colorWarning} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Card
          hoverable
          onClick={() => navigate("/admin/dashboard/tour-enquiry")}
          style={{
            borderLeft: `4px solid ${token.colorError}`,
            borderRadius: "8px",
          }}
        >
          <Statistic
            title="Tour Enquiries"
            value={counts.tourEnquiries}
            valueStyle={{ color: token.colorError, fontWeight: "bold" }}
            prefix={<MapPin size={24} color={token.colorError} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Card
          hoverable
          onClick={() => navigate("/admin/dashboard/contact-enquiry")}
          style={{
            borderLeft: `4px solid #1890ff`,
            borderRadius: "8px",
          }}
        >
          <Statistic
            title="Contact Enquiries"
            value={counts.contactEnquiries}
            valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
            prefix={<PhoneCall size={24} color="#1890ff" />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCards;
