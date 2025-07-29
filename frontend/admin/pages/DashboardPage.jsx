import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Space,
  Avatar,
  Dropdown,
  theme,
  Modal,
  ConfigProvider,
} from "antd";
import {
  Gauge,
  Newspaper,
  PhoneCall,
  ChevronDown,
  Package,
  Settings,
  LogOut,
  User,
  Sliders,
} from "lucide-react";
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import axios from "axios";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { SubMenu } = Menu;

const corbettTheme = {
  token: {
    colorPrimary: "#2C5F2D",
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f5f7f2",
    colorTextBase: "#333333",
    colorTextSecondary: "#666666",
    colorBgElevated: "#edf3e7",
    colorBorder: "#c9d8b6",
  },
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const [logoUrl, setLogoUrl] = useState(null);
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin",
    avatar: null,
  });
// Add this useEffect at the top of your DashboardPage component
useEffect(() => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    navigate("/admin/login");
  }
}, [navigate]);
  const handleLogout = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      okText: "Logout",
      cancelText: "Cancel",
      onOk: () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      },
    });
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/global-setting`).then((res) => {
      if (res.data.logoUrl) {
        setLogoUrl(`${import.meta.env.VITE_API_URL}${res.data.logoUrl}`);
      }
    });
  }, []);
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAdminProfile(res.data);
      } catch (err) {
        console.error("Failed to load admin profile", err);
      }
    };

    fetchAdminProfile();
  }, []);
  const menuItems = [
    {
      key: "dashboard",
      icon: <Gauge size={20} />,
      label: "Dashboard",
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      key: "/admin/dashboard/contact-enquiry",
      icon: <PhoneCall size={18} />,
      label: "Contact Enquiry",
      onClick: () => navigate("/admin/dashboard/contact-enquiry"),
    },
    {
    key: "/admin/dashboard/orders",
    icon: <Package size={20} />,
    label: "Orders",
    onClick: () => navigate("/admin/dashboard/orders"),
  },
    {
      key: "/admin/dashboard/blogs",
      icon: <Newspaper size={18} />,
      label: "Blogs",
      onClick: () => navigate("/admin/dashboard/blogs"),
    },
    {
      key: "settings",
      icon: <Settings size={20} />,
      label: "Settings",
      children: [
        {
          key: "/admin/dashboard/setting",
          icon: <Sliders size={18} />,
          label: "Global Settings",
          onClick: () => navigate("/admin/dashboard/setting"),
        },
      ],
    }
  ];

  const userMenu = [
    {
      key: "profile",
      icon: <User size={16} />,
      label: "Profile",
      onClick: () => navigate("/admin/dashboard/Admin-profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={16} />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <ConfigProvider theme={corbettTheme}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: token.colorBgElevated,
            boxShadow: "2px 0 10px rgba(0, 0, 0, 0.08)",
          }}
          width={240}
        >
          <div
            style={{
              padding: "20px 16px",
              textAlign: "center",
              borderBottom: `1px solid ${token.colorBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              paddingLeft: collapsed ? 0 : 24,
              height: 64,
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Admin Logo"
                style={{ maxHeight: 40, maxWidth: "100%", objectFit: "contain" }}
              />
            ) : (
              <Title level={4} style={{ margin: 0, marginLeft: 12 }}>
                Admin Panel
              </Title>
            )}
          </div>

          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={["bookings", "enquiries", "management"]}
            style={{
              borderRight: 0,
              backgroundColor: "transparent",
              padding: "12px 0",
            }}
          >
            {menuItems.map((item) => (
              item.children ? (
                <SubMenu
                  key={item.key}
                  icon={item.icon}
                  title={item.label}
                  style={{ margin: "4px 8px", borderRadius: "8px" }}
                >
                  {item.children.map((child) => (
                    <Menu.Item
                      key={child.key}
                      icon={child.icon}
                      onClick={child.onClick}
                      style={{ margin: "4px 0", paddingLeft: 36, borderRadius: "4px" }}
                    >
                      {child.label}
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  onClick={item.onClick}
                  style={{
                    margin: "4px 8px",
                    borderRadius: "8px",
                    paddingLeft: collapsed ? 24 : 28,
                  }}
                >
                  {item.label}
                </Menu.Item>
              )
            ))}
          </Menu>
        </Sider>

        <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: "all 0.3s" }}>
          <Header
            style={{
              padding: "0 24px",
              background: token.colorBgContainer,
              position: "sticky",
              top: 0,
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 64,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 48, height: 48 }}
            />

            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
              <Space style={{ cursor: "pointer", padding: "8px 12px" }}>
                <Avatar
                    src={
                      adminProfile.avatar
                        ? `${import.meta.env.VITE_API_URL}${adminProfile.avatar}`
                        : null
                    }
                    style={{
                      backgroundColor: token.colorPrimary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    size={32}
                    icon={!adminProfile.avatar && <UserOutlined />}
                  /> 
                <span>{adminProfile.name}</span>
                <ChevronDown size={16} />
              </Space>
            </Dropdown>
          </Header>

          <Content style={{ margin: "24px", padding: 24, minHeight: 280 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DashboardPage;