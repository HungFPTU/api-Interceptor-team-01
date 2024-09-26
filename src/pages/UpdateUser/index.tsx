import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import userAPI from '../../api/userAPI';
import { useNavigate } from 'react-router-dom';

interface UserDetails {
  fullName: string;
  email: string;
  password: string; 
  createDate: string;
  updateDate: string;
  userId: number;
}

const UpdateUserInfo: React.FC = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const userString = localStorage.getItem('user');

    if (userString) {
      const user = JSON.parse(userString);
      setUserDetails(user); // Lấy thông tin người dùng từ localStorage
      form.setFieldsValue({ // Tự động điền dữ liệu vào form
        name: user.fullName, 
        password: user.password, 
      });
    } else {
      notification.error({
        message: 'User Not Found',
        description: 'Please log in again.',
      });
      navigate('/login');
    }
  }, [navigate, form]);

  const onFinish = async (values: { name: string; password: string }) => {
    const userString = localStorage.getItem('user');

    if (userString) {
      const user = JSON.parse(userString);
      const userId = user.userId;

      if (!userId || !userDetails) {
        notification.error({
          message: 'Update Failed',
          description: 'User not found. Please log in again.',
        });
        return;
      }

      // Cập nhật thông tin người dùng
      const updatedUser = {
        ...userDetails,
        fullName: values.name,
        password: values.password,
        updateDate: new Date().toISOString(),
      };

      try {
        // Gọi API để lưu thông tin người dùng
        const response = await userAPI.updateUserIdAPI(
          { userId: Number(userId) },
          updatedUser
        );

        if (response.status === 200) {
          // Cập nhật localStorage nếu thành công
          localStorage.setItem('user', JSON.stringify(updatedUser));
          notification.success({
            message: 'Update Successful',
            description: 'User information has been updated successfully.',
          });
          navigate('/'); // chuyển đến trang home
        } else {
          notification.error({
            message: 'Update Failed',
            description: 'Failed to update user information.',
          });
        }
      } catch (error: unknown) {
        notification.error({
          message: 'Update Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      }
    } else {
      notification.error({
        message: 'Update Failed',
        description: 'User not found. Please log in again.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Form
        form={form} // Kết nối form với component
        name="updateUserInfo"
        onFinish={onFinish}
        className="w-full max-w-sm bg-white p-8 rounded shadow-md"
      >
        <h2 className="text-2xl mb-6 text-center">Update User Information</h2>

        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your Name!' }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password placeholder="New Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full mt-3">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateUserInfo;