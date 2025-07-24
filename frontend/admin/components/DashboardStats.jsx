import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Spin, message, Typography, Select } from "antd";
import {
  MessageCircle,
  Compass,
  Hotel,
  MapPin,
  PhoneCall,
  TrendingUp,
  Calendar
} from "lucide-react";
import axios from "axios";
import { theme } from "antd";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import moment from "moment";

const { useToken } = theme;
const { Title } = Typography;
const { Option } = Select;

const DashboardStats = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const [loading, setLoading] = useState(true);
  // ... (other state declarations remain the same)
  const [timeRange, setTimeRange] = useState('all'); // Changed default to 'all
  const [counts, setCounts] = useState({
    totalEnquiries: 0,
    safariEnquiries: 0,
    hotelEnquiries: 0,
    tourEnquiries: 0,
    contactEnquiries: 0
  });

  // Colors for dashboard
  const colors = {
    total: "#5D34FF",
    safari: "#00C48C", 
    hotel: "#FF6D41",
    tour: "#FFBD35",
    contact: "#0080FF"
  };

  // Real data states
  const [dailyData, setDailyData] = useState([]);
  const [sourcesData, setSourcesData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const filterEnquiriesByTimeRange = (enquiries, range) => {
    if (range === 'all') {
      return enquiries; // Return all enquiries without filtering
    }

    const now = moment();
    let startDate;
    
    switch(range) {
      case 'today':
        startDate = now.startOf('day');
        break;
      case 'week':
        startDate = now.clone().subtract(1, 'week');
        break;
      case 'month':
        startDate = now.clone().subtract(1, 'month');
        break;
      case 'year':
        startDate = now.clone().subtract(1, 'year');
        break;
      default:
        return enquiries; // Fallback to all enquiries
    }
    
    return enquiries.filter(enquiry => {
      const enquiryDate = moment(enquiry.createdAt || enquiry.date || enquiry.timestamp);
      return enquiryDate.isBetween(startDate, now, null, '[]');
    });
  };
  // Group data by day for daily trends
  const groupByDay = (enquiries) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const grouped = {};
    
    // Initialize empty counts for each day
    days.forEach(day => {
      grouped[day] = {
        safari: 0,
        hotel: 0,
        tour: 0,
        contact: 0
      };
    });
    
    // Count enquiries by day and type
    enquiries.forEach(enquiry => {
      const date = moment(enquiry.createdAt || enquiry.date || enquiry.timestamp);
      const day = days[date.day()];
      const type = enquiry.type || enquiry.enquiryType;
      
      if (grouped[day] && type) {
        grouped[day][type]++;
      }
    });
    
    return days.map(day => ({
      day,
      ...grouped[day]
    }));
  };

  // Group data by month for monthly comparison
  const groupByMonth = (enquiries) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const grouped = {};
    
    months.forEach(month => {
      grouped[month] = {
        safari: 0,
        hotel: 0,
        tour: 0,
        contact: 0
      };
    });
    
    enquiries.forEach(enquiry => {
      const date = moment(enquiry.createdAt || enquiry.date || enquiry.timestamp);
      const month = months[date.month()];
      const type = enquiry.type || enquiry.enquiryType;
      
      if (grouped[month] && type) {
        grouped[month][type]++;
      }
    });
    
    return months.map(month => ({
      month,
      ...grouped[month]
    }));
  };

  // Calculate source distribution
  const calculateSourceDistribution = (enquiries) => {
    const sources = {
      'Homepage': 0,
      'Safari Page': 0,
      'Hotel Page': 0,
      'Tour Page': 0,
      'Contact Page': 0
    };
    
    enquiries.forEach(enquiry => {
      if (enquiry.source) {
        sources[enquiry.source] = (sources[enquiry.source] || 0) + 1;
      } else if (enquiry.page) {
        sources[`${enquiry.page} Page`] = (sources[`${enquiry.page} Page`] || 0) + 1;
      } else {
        sources['Homepage']++;
      }
    });
    
    return Object.entries(sources)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
        color: 
          name === 'Safari Page' ? colors.safari :
          name === 'Hotel Page' ? colors.hotel :
          name === 'Tour Page' ? colors.tour :
          name === 'Contact Page' ? colors.contact :
          colors.total
      }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all enquiry data
        const [
          safariRes,
          hotelRes,
          tourRes,
          contactRes
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/safarienquiry/`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/hotelenquiry`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/tour/tour-enquiries`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/contactenquiry/`)
        ]);

        // Process raw data with type information
        const safariEnquiries = (safariRes.data?.enquiries || safariRes.data || []).map(e => ({ ...e, type: 'safari' }));
        const hotelEnquiries = (hotelRes.data || []).map(e => ({ ...e, type: 'hotel' }));
        const tourEnquiries = (tourRes.data?.enquiries || tourRes.data || []).map(e => ({ ...e, type: 'tour' }));
        const contactEnquiries = (contactRes.data?.contacts || contactRes.data || []).map(e => ({ ...e, type: 'contact' }));

        // Combine all enquiries
        const allEnquiries = [
          ...safariEnquiries,
          ...hotelEnquiries,
          ...tourEnquiries,
          ...contactEnquiries
        ];

        // Filter by selected time range
        const filteredEnquiries = filterEnquiriesByTimeRange(allEnquiries, timeRange);

        // Set counts
        setCounts({
          totalEnquiries: filteredEnquiries.length,
          safariEnquiries: safariEnquiries.length,
          hotelEnquiries: hotelEnquiries.length,
          tourEnquiries: tourEnquiries.length,
          contactEnquiries: contactEnquiries.length
        });

        // Prepare chart data
        setDailyData(groupByDay(filteredEnquiries));
        setMonthlyData(groupByMonth(allEnquiries)); // Use all data for monthly view
        setSourcesData(calculateSourceDistribution(filteredEnquiries));

      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);
  const renderStatCard = (title, count, icon, color, path) => {
    return (
      <Card
        hoverable
        onClick={() => navigate(path)}
        className="stat-card"
        style={{
          borderRadius: "16px",
          border: "none",
          background: `linear-gradient(145deg, ${color}10, ${color}25)`,
          boxShadow: `0 12px 24px ${color}20`,
          height: "100%",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          zIndex: 1
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: `${color}20`,
            zIndex: 0
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            background: `${color}15`,
            zIndex: 0
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div 
              style={{ 
                background: color,
                borderRadius: "14px",
                padding: "14px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: `0 8px 16px ${color}40`
              }}
            >
              {React.cloneElement(icon, { size: 28, color: '#fff' })}
            </div>
            <div 
              style={{ 
                background: "#ffffff",
                borderRadius: "50px", 
                padding: "6px 16px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            >
              <TrendingUp size={14} color={color} />
              <span style={{ color: color, fontWeight: "600", fontSize: "13px" }}>
                +{Math.floor(Math.random() * 25) + 5}%
              </span>
            </div>
          </div>
          
          <div style={{ marginTop: "20px" }}>
            <Title level={2} style={{ margin: 0, color: color, fontWeight: "700", fontSize: "32px" }}>
              {count}
            </Title>
            <div style={{ color: "#555", marginTop: "6px", fontSize: "16px", fontWeight: "600" }}>
              {title}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-stats-container" style={{ padding: "16px" }}>
      {/* Header with time range selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Title level={4} style={{ margin: 0, color: "#333", fontWeight: "700" }}>
          Enquiry Analytics Dashboard
        </Title>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Calendar size={18} />
          <Select 
            value={timeRange}
            style={{ width: 120 }} 
            onChange={setTimeRange}
            bordered={false}
            dropdownStyle={{ borderRadius: "12px" }}
          >
            <Option value="all">All Enquiries</Option> {/* Added new option */}
            <Option value="today">Today</Option>
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
            <Option value="year">This Year</Option>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
          {renderStatCard(
            "Total Enquiries", 
            counts.totalEnquiries, 
            <MessageCircle />, 
            colors.total, 
            "/admin/dashboard/enquiries"
          )}
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
          {renderStatCard(
            "Safari Enquiries", 
            counts.safariEnquiries, 
            <Compass />, 
            colors.safari, 
            "/admin/dashboard/safari-enquiry"
          )}
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
          {renderStatCard(
            "Hotel Enquiries", 
            counts.hotelEnquiries, 
            <Hotel />, 
            colors.hotel, 
            "/admin/dashboard/hotel-enquiry"
          )}
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          {renderStatCard(
            "Tour Enquiries", 
            counts.tourEnquiries, 
            <MapPin />, 
            colors.tour, 
            "/admin/dashboard/tour-enquiry"
          )}
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          {renderStatCard(
            "Contact Enquiries", 
            counts.contactEnquiries, 
            <PhoneCall />, 
            colors.contact, 
            "/admin/dashboard/contact-enquiry"
          )}
        </Col>
      </Row>

      {/* Daily Trends Chart */}
      <Card
        title={<div style={{ color: "#333", fontWeight: "600" }}>Daily Enquiry Trends</div>}
        style={{ 
          borderRadius: "16px", 
          marginBottom: "24px", 
          border: "none",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)" 
        }}
        bodyStyle={{ padding: "20px" }}
        headStyle={{ backgroundColor: "#f9f9f9", borderRadius: "16px 16px 0 0" }}
      >
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} 
              />
              <Legend />
              <Line type="monotone" dataKey="safari" stroke={colors.safari} strokeWidth={3} dot={{ stroke: colors.safari, strokeWidth: 2, r: 4, fill: "white" }} />
              <Line type="monotone" dataKey="hotel" stroke={colors.hotel} strokeWidth={3} dot={{ stroke: colors.hotel, strokeWidth: 2, r: 4, fill: "white" }} />
              <Line type="monotone" dataKey="tour" stroke={colors.tour} strokeWidth={3} dot={{ stroke: colors.tour, strokeWidth: 2, r: 4, fill: "white" }} />
              <Line type="monotone" dataKey="contact" stroke={colors.contact} strokeWidth={3} dot={{ stroke: colors.contact, strokeWidth: 2, r: 4, fill: "white" }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            No data available for the selected time range
          </div>
        )}
      </Card>

      {/* Bottom Charts - Now using real data */}
      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Card
            title={<div style={{ color: "#333", fontWeight: "600" }}>Enquiry Sources</div>}
            style={{ 
              borderRadius: "16px", 
              border: "none",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
            }}
            bodyStyle={{ padding: "20px" }}
            headStyle={{ backgroundColor: "#f9f9f9", borderRadius: "16px 16px 0 0" }}
          >
            {sourcesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} enquiries`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                No source data available
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<div style={{ color: "#333", fontWeight: "600" }}>Monthly Comparison</div>}
            style={{ 
              borderRadius: "16px", 
              border: "none",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
            }}
            bodyStyle={{ padding: "20px" }}
            headStyle={{ backgroundColor: "#f9f9f9", borderRadius: "16px 16px 0 0" }}
          >
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} 
                  />
                  <Legend />
                  <Bar dataKey="safari" name="Safari" fill={colors.safari} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="hotel" name="Hotel" fill={colors.hotel} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="tour" name="Tour" fill={colors.tour} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="contact" name="Contact" fill={colors.contact} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                No monthly data available
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStats;