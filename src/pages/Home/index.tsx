import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Upload,
  Image,
  DatePicker,
  message,
  Breadcrumb,
  Layout,
  Dropdown,
  Menu,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import postAPI from "../../api/postAPI";
import userAPI from "../../api/userAPI";
import { Post, User } from "../../model/RouteConfig";
import uploadFile from "../../utils/upload";
import assets from "../../assets/assets";
const { Search } = Input;
const { Header, Content, Footer, Sider } = Layout;

// Utility to get base64 from file
const getBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form] = useForm();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [userNames, setUserNames] = useState<{ [userId: number]: string }>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [user, setUser] = useState<User[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
      } catch (error) {
        message.error("Error fetching posts.");
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
      message.error("Error fetching user details.");
      console.log(error);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      let url = "";

      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        url = await uploadFile(fileList[0].originFileObj);
      } else if (fileList.length > 0 && fileList[0]?.url) {
        url = fileList[0].url;
      } else {
        message.error("Please provide an image.");
        throw new Error("No image provided.");
      }

      const newPost = {
        ...values,
        image: url,
        dateCreate: dayjs(values.createDate).unix(),
        updateDate: dayjs().toISOString(),
      };

      if (isEditing && currentPostId !== null) {
        await postAPI.updatePostIdAPI({ postId: currentPostId }, newPost);
        const updatedPosts = posts.map((post) =>
          post.postId === currentPostId
            ? { ...newPost, postId: currentPostId }
            : post
        );
        setPosts(updatedPosts);
        message.success("Post updated successfully!");
      } else {
        const response = await postAPI.createNewPostAPI(newPost);
        setPosts([...posts, { ...newPost, postId: response.data.postId }]);
        message.success("Post created successfully!");
      }

      setShowModal(false);
      form.resetFields();
      setFileList([]);
      setIsEditing(false);
      setCurrentPostId(null);
    } catch (error) {
      message.error("Failed to save post.");
      console.error("Failed to save post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post: Post) => {
    setIsEditing(true);
    setCurrentPostId(post.postId);
    form.setFieldsValue({
      ...post,
      createDate: dayjs.unix(post.dateCreate),
      updateDate: dayjs(post.updateDate, "YYYY-MM-DDTHH:mm:ss"),
    });
    setFileList([
      {
        uid: "-1",
        name: "image",
        status: "done",
        url: post.image,
      },
    ]);
    setShowModal(true);
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await postAPI.deletetePostIdAPI({ postId });
      setPosts(posts.filter((post) => post.postId !== postId));
      message.success("Post deleted successfully!");
    } catch (error) {
      message.error("Failed to delete post.");
      console.error("Failed to delete post:", error);
    }
  };

  const handleCreateNewPost = () => {
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    form.resetFields();
    setIsEditing(false);
    setCurrentPostId(null);
    setFileList([]);

    if (currentUser && currentUser.userId) {
      form.setFieldsValue({ userId: currentUser.userId });
    }

    setShowModal(true);
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }: any) =>
    setFileList(newFileList);

  const columns = [
    {
      title: "ID",
      dataIndex: "postId",
      key: "postId",
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (image: string) => <Image src={image} width={100} />,
    },
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      align: "center",
      render: (userId: number) => userNames[userId] || "Loading...",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      align: "center",
    },
    {
      title: "Create Date",
      dataIndex: "dateCreate",
      key: "dateCreate",
      align: "center",
      render: (dateCreate: number) =>
        dayjs.unix(dateCreate).format("YYYY-MM-DD | HH:mm:ss"),
    },
    {
      title: "Update Date",
      dataIndex: "updateDate",
      key: "updateDate",
      align: "center",
      render: (updateDate: string) =>
        dayjs(updateDate).format("YYYY-MM-DD | HH:mm:ss"),
    },
    {
      title: "Actions",
      dataIndex: "postId",
      key: "postId",
      align: "center",
      render: (postId: number, record: Post) => (
        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleEditPost(record)}
          >
            Update
          </Button>
          <Popconfirm
            title="Delete the post"
            description="Are you sure to delete this post?"
            onConfirm={() => handleDeletePost(postId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/updateuser")}>
        Update User
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
      >
        <div style={{ textAlign: "center", marginTop: "10px" }}>
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
            onSearch={(value) =>
              setPosts(
                originalPosts.filter((post) =>
                  post.title.toLowerCase().includes(value.toLowerCase())
                )
              )
            }
            className="w-full sm:w-1/2 mb-2 sm:mb-0"
          />
          {user ? (
            <div className="flex items-center space-x-3">
              <Dropdown overlay={menu}>
                <span className="ant-dropdown-link cursor-pointer">
                  Hi, {user.fullName} <DownOutlined />
                </span>
              </Dropdown>
              <Button type="primary" onClick={handleCreateNewPost}>
                Create New Post
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  localStorage.removeItem("user");
                  setUser(null);
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button type="primary" onClick={() => navigate("/login")}>
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
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-5">
                {posts.map((post) => (
                  <div
                    className="wrapper flex flex-col gap-3 p-5 rounded-2xl border-2 border-[#e8e8e8]"
                    key={post.postId}
                  >
                    <div className="header flex items-center justify-between">
                      <div className="author flex items-center">
                        <img
                          src={assets.avatar}
                          className="w-[3em] h-[3em] object-cover rounded-full"
                          alt="avatar"
                        />
                        <span className="name text-[1.2rem] font-semibold ml-2">
                          {userNames[post.userId] || "Loading..."}
                        </span>
                      </div>
                    </div>
                    <div className="body flex flex-col">
                      <div className="info text-2xl flex-1 pr-8">
                        {post.title}
                        <p className="context mt-1 text-xl text-gray-600">
                          {post.content}
                        </p>
                      </div>
                      <img
                        className="w-full sm:w-[200px] max-h-[120px] rounded-[15px] mt-4"
                        src={post.image}
                        alt={post.title}
                      />
                      <div className="date mt-4">
                        <span className="time">
                          Create date:{" "}
                          {new Date(post.dateCreate * 1000).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Manager Post Table */}
            <Table
              dataSource={posts}
              columns={columns}
              pagination={{ position: ["bottomCenter"] }}
              rowKey={(record) => record.postId}
            />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>

      <Modal
        onCancel={() => setShowModal(false)}
        open={showModal}
        footer={[
          <Button key="back" onClick={() => setShowModal(false)}>
            Cancel
          </Button>,
          <Button
            type="primary"
            style={{ background: "green", color: "white" }}
            onClick={() => form.submit()}
            loading={loading}
          >
            Submit
          </Button>,
        ]}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          <Form.Item name="postId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="userId"
            label="User ID"
            rules={[{ required: true, message: "Please input User ID!" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input post title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please input post content!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 1 ? null : <PlusOutlined />}
            </Upload>
          </Form.Item>

          <Form.Item name="createDate" label="Create Date">
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              disabled
            />
          </Form.Item>

          <Form.Item name="updateDate" label="Update Date">
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              disabled={isEditing}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Image
        style={{ display: "none" }}
        preview={{
          visible: previewOpen,
          src: previewImage,
          onVisibleChange: (value) => setPreviewOpen(value),
        }}
      />
    </Layout>
  );
};

export default Home;
