import { PieChartOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, Input, Button, Card, Col, Row, Avatar } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPostAPI } from "../../api/postAPI"; // Adjust the path as needed
import { Post } from "../../model/RouteConfig"; // Adjust the path as needed

const { Search } = Input;
const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;
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

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPostAPI();
        setPosts(response.data);
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchPosts();
  }, []);

  const onSearch = (value: string) => {
    console.log("Search value:", value);
    // Add further search logic if needed
  };

  const handleLogin = () => {
    console.log("Login clicked");
    // Add login functionality if needed
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
              minHeight: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >




            {/* Post Loading and Display */}
            <div className="space-y-5">
            {posts.map((post) => {
                  const date = new Date(post.dateCreate * 1000).toLocaleString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });

                  return (
                    <div className="wrapper flex flex-col gap-3 p-5 rounded-2xl border-2 border-[#e8e8e8]" key={post.postId}>
                      <div className="body flex items-center">
                        <div className="info text-2xl flex-1 pr-8">
                          {post.title}
                          <p className="context mt-1 text-xl leading-6 text-gray-600">
                            {post.content}
                          </p>
                          <div className="date mt-4">
                            <a className="front px-2.5 py-1 rounded-full bg-[#f2f2f2] text-[#333] leading-8 mr-3 font-medium">Front-end</a>
                            <span className="time mt-0 mr-32 mb-0 ml-0">{date}</span>
                          </div>
                        </div>
                        <div className="thumb flex-shrink-0">
                          <img className="w-[200px] max-h-[120px] rounded-[15px] block leading-[1.8] text-[1.4rem] text-[#757575] bg-[#ebebeb] overflow-hidden text-center object-cover"
                            src={post.image}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

           
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
