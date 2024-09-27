import React from "react";
import { Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import userAPI from "../../api/userAPI";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormValues) => {
    console.log("Received values:", values);
    try {
      // Gọi API để tạo người dùng mới
      const res = await userAPI.createUserAPI({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
      });

      if (res.status === 201) {
        notification.success({
          message: "Registration Successful",
          description: "Account created successfully.",
        });

        // Chuyển hướng về trang đăng nhập sau khi đăng ký thành công
        navigate("/login");
      } else {
        notification.error({
          message: "Registration Failed",
          description: "Failed to create the account. Please try again.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Registration Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Form
        name="register"
        onFinish={onFinish}
        className="w-full max-w-sm bg-white p-8 rounded shadow-md"
      >
        <h2 className="text-2xl mb-6 text-center">Register</h2>

        <Form.Item
          name="fullName"
          rules={[{ required: true, message: "Please input your Full Name!" }]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
              type: "email",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full mt-3">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
