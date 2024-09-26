import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import userAPI from '../../api/userAPI';

const EditProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const onFinish = async (values: any) => {
    // Kiểm tra user và userId
    if (!user || !user.userId) {
      notification.error({
        message: 'Error',
        description: 'User ID is not found.',
      });
      return;
    }

    try {
      // Tạo đối tượng cập nhật với thông tin từ form và user
      const updatedUser = {
        fullName: values.fullName,
        email: user.email, // Giữ email cũ
        password: values.password,
        createDate: user.createDate, // Giữ ngày tạo cũ
        updateDate: new Date().toISOString(),
      };

      // Gọi API để cập nhật thông tin người dùng
      await userAPI.updateUserIdAPI(user.userId, updatedUser);

      // Cập nhật lại localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));

      notification.success({
        message: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Hoặc có thể hiển thị một loading spinner
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Form
        name="editProfile"
        onFinish={onFinish}
        className="w-full max-w-sm bg-white p-8 rounded shadow-md"
        initialValues={{ fullName: user.fullName, password: user.password }}
      >
        <h2 className="text-2xl mb-6 text-center">Edit Profile</h2>
        
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: 'Please input your Full Name!' }]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password placeholder="Password" />
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

export default EditProfile;