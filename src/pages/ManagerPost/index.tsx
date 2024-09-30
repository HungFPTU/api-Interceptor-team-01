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
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import postAPI from "../../api/postAPI";
import userAPI from "../../api/userAPI";
import { Post } from "../../model/RouteConfig";
import uploadFile from "../../utils/upload";

// Utility to get base64 from file
const getBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

function ManagePost() {
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
  // const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // This logic can be removed if user is not needed anywhere
      // setUser(JSON.parse(storedUser)); // This line is removed
    }

    const fetchPosts = async () => {
      try {
        const response = await postAPI.getAllPostAPI();
        setPosts(response.data);

        await Promise.all(
          response.data.map((post: { userId: number }) =>
            getUserById(post.userId)
          )
        );
      } catch (error) {
        message.error("Error fetching posts.");
        console.error("Error fetching posts:", error);
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

      // Check if a new image is being uploaded
      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        url = await uploadFile(fileList[0].originFileObj);
      } else if (fileList.length > 0 && fileList[0]?.url) {
        // Use the existing image URL if no new file is uploaded
        url = fileList[0].url;
      } else {
        message.error("Please provide an image.");
        throw new Error("No image provided.");
      }

      const newPost = {
        ...values,
        image: url,
        dateCreate: dayjs(values.createDate).unix(), // Keep the createDate as the user selects
        updateDate: dayjs().toISOString(), // Always use the current date and time for updateDate
      };

      if (isEditing && currentPostId !== null) {
        // Update the existing post
        await postAPI.updatePostIdAPI({ postId: currentPostId }, newPost);
        const updatedPosts = posts.map((post) =>
          post.postId === currentPostId
            ? { ...newPost, postId: currentPostId }
            : post
        );
        setPosts(updatedPosts);
        message.success("Post updated successfully!");
      } else {
        // Create a new post
        const response = await postAPI.createNewPostAPI(newPost);
        setPosts([...posts, { ...newPost, postId: response.data.postId }]);
        message.success("Post created successfully!");
      }

      // Reset form and close modal
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
      align: "center" as const, // Ensure this is a valid AlignType
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center" as const,
      render: (image: string) => <Image src={image} width={100} />,
    },
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      align: "center" as const,
      render: (userId: number) => userNames[userId] || "Loading...",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center" as const,
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      align: "center" as const,
    },
    {
      title: "Create Date",
      dataIndex: "dateCreate",
      key: "dateCreate",
      align: "center" as const,
      render: (dateCreate: number) =>
        dayjs.unix(dateCreate).format("YYYY-MM-DD | HH:mm:ss"),
    },
    {
      title: "Update Date",
      dataIndex: "updateDate",
      key: "updateDate",
      align: "center" as const,
      render: (updateDate: string) =>
        dayjs(updateDate).format("YYYY-MM-DD | HH:mm:ss"),
    },
    {
      title: "Actions",
      dataIndex: "postId",
      key: "postId",
      align: "center" as const,
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

  return (
    <div>
      <div style={{ padding: "10px" }}>
        <Button
          onClick={handleCreateNewPost}
          style={{ background: "green", color: "white" }}
        >
          Create New Post
        </Button>
      </div>
      <Table
        dataSource={posts}
        columns={columns}
        pagination={{ position: ["bottomCenter"] }}
        rowKey={(record) => record.postId}
      />

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
              value={dayjs()} // Automatically populate with current date and time
              disabled // Always disabled
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
    </div>
  );
}

export default ManagePost;
