import { PieChartOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link to={key}>{label}</Link>, //label = label ,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Task", "/dashboard/task", <PieChartOutlined />),
];

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {!collapsed ? (
          <div
            className="demo-logo-vertical"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            <img
              src="https://zitechdev.com/assets/img/fpt-software-academy-logo.png"
              alt="logo"
              width={120}
              className="header__logo"
            />
          </div>
        ) : (
          <div
            className="demo-logo-vertical"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDjeKtNqC1J3ESidess2Bz4LIvI5f0t-okMskBO3wI70vq7VTqD4ld-UKq6U1ThZkSK6E&usqp=CAU"
              alt="logo"
              width={50}
              className="header__logo"
            />
          </div>
        )}
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "white" }}>
          <div style={{ textAlign: "center" }}>
            <h1>Welcome To Do List App</h1>
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Task</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
