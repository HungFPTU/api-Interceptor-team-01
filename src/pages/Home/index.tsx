import { PieChartOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, Input, Button, Card, Col, Row } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPostAPI } from "../../api/postAPI"; // Adjust the path as needed
import { Post } from "../../model/RouteConfig"; // Adjust the path as needed

const { Search } = Input;
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
    label: <Link to={key}>{label}</Link>,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Task", "/dashboard/task", <PieChartOutlined />),
];

const Home: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPostAPI();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const onSearch = (value: string) => {
    console.log("Search value:", value);
  };

  const handleLogin = () => {
    console.log("Login clicked");
    // Add login logic here
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          className="demo-logo-vertical flex justify-center mt-2"
          style={{ textAlign: "center", marginTop: "10px" }}
        >
          <img
            src={
              !collapsed
                ? "https://zitechdev.com/assets/img/fpt-software-academy-logo.png"
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDjeKtNqC1J3ESidess2Bz4LIvI5f0t-okMskBO3wI70vq7VTqD4ld-UKq6U1ThZkSK6E&usqp=CAU"
            }
            alt="logo"
            width={collapsed ? 50 : 120}
            className="header__logo"
          />
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "white", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "16px 0",
            }}
          >
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              style={{ width: 400 }}
            />
            <Button type="primary" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
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
            <Row gutter={16}>
              {loading ? (
                <p>Loading...</p>
              ) : (
                posts.map((post) => (
                  <Col span={8} key={post.postId}>
                    <Card className="card-spacing" title={post.title} bordered={false}>
                      {post.content}
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;
