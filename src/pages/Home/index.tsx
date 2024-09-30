import { Breadcrumb, Layout, theme, Input, Button, Dropdown, Menu } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import postAPI from "../../api/postAPI";
import { Post } from "../../model/RouteConfig";
import assets from "../../assets/assets";
import userAPI from "../../api/userAPI";
const { Search } = Input;
const { Header, Content, Footer, Sider } = Layout;

const Home: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userNames, setUserNames] = useState<{ [userId: number]: string }>({});
  const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getUserById = async (userId: number) => {
    try {
      if (!userNames[userId]) {
        const res = await userAPI.getUserIdAPI({ userId });
        setUserNames((prevUserNames) => ({
          ...prevUserNames,
          [userId]: res.data.fullName,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setOriginalPosts(posts);
  }, [posts]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchPosts = async () => {
      try {
        const response = await postAPI.getAllPostAPI();
        setPosts(response.data);
        setOriginalPosts(response.data);

        await Promise.all(
          response.data.map((post: { userId: number }) =>
            getUserById(post.userId)
          )
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const onSearch = (value: string) => {
    if (value.trim() === "") {
      setPosts(originalPosts);
    } else {
      setPosts((prevPosts) => [
        ...prevPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(value.toLowerCase()) ||
            post.content.toLowerCase().includes(value.toLowerCase())
        ),
        ...originalPosts.filter(
          (post) =>
            !prevPosts.some((p) => p.postId === post.postId) &&
            (post.title.toLowerCase().includes(value.toLowerCase()) ||
              post.content.toLowerCase().includes(value.toLowerCase()))
        ),
      ]);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleManagerPost = () => {
    navigate("/manager-post");
  };

  const handleUpdateUser = () => {
    navigate("/updateuser");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleUpdateUser}>
        Update User
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
        width={250}
      >
        <div className="demo-logo-vertical flex justify-center mt-2">
          <img
            src={
              !collapsed
                ? "https://zitechdev.com/assets/img/fpt-software-academy-logo.png"
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDjeKtNqC1J3ESidess2Bz4LIvI5f0t-okMskBO3wI70vq7VTqD4ld-UKq6U1ThZkSK6E&usqp=CAU"
            }
            alt="logo"
            width={collapsed ? 50 : 120}
          />
        </div>
      </Sider>
      <Layout>
        <Header className="bg-white flex flex-col sm:flex-row justify-between items-center p-4">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            className="w-full sm:w-1/2 mb-2 sm:mb-0"
          />
          {user ? (
            <div className="flex items-center space-x-3">
              <Dropdown overlay={menu}>
                <span
                  className="ant-dropdown-link cursor-pointer"
                  onClick={(e) => e.preventDefault()}
                >
                  Hi, {user.fullName} <DownOutlined />
                </span>
              </Dropdown>
              <Button type="primary" onClick={handleManagerPost}>
                Manager Post
              </Button>
              <Button type="primary" danger onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button type="primary" onClick={handleLogin}>
              Login
            </Button>
          )}
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
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-5">
                {posts.map((post) => {
                  const date = new Date(post.dateCreate * 1000).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }
                  );
                  const updateDate = new Date(post.updateDate).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }
                  );

                  return (
                    <div
                      className="wrapper flex gap-3 p-5 rounded-2xl border-2 border-[#e8e8e8]"
                      key={post.postId}
                    >
                      <div className="content flex-1 pr-8">
                        <div className="header flex items-center justify-between">
                          <div className="author flex items-center">
                            <img
                              alt=""
                              src={assets.avatar}
                              className="avatar2 w-[3em] h-[3em] object-cover rounded-full"
                            />
                            <span className="name text-[1.2rem] text-[#292929] font-semibold ml-2">
                              {userNames[post.userId] || "Loading..."}
                            </span>
                          </div>
                        </div>
                        <div className="body">
                          <h2 className="text-2xl">{post.title}</h2>
                          <p className="mt-1 text-xl leading-6 text-gray-600">
                            {post.content}
                          </p>
                          <div className="date mt-4">
                            <span className="time">Create date: {date}</span>
                          </div>
                          <div className="date mt-4">
                            <span className="time">
                              Update date: {updateDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="thumb flex-shrink-0 w-[200px]">
                        <img
                          className="max-h-[120px] rounded-[15px] object-cover"
                          src={post.image}
                          alt="post"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
