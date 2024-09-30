import React from 'react';
import { Form, Input, Button, Checkbox, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import userAPI from '../../api/userAPI';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleBackHome = () =>{
    navigate("/")
  }
  const onFinish = async (values: any) => {
    console.log('Received values:', values);
    try {
      const res = await userAPI.getAllUserAPI();
      const userdata = res.data;

      // Kiểm tra thông tin đăng nhập
      const user = userdata.find((user: any) => 
        user.email === values.username && user.password === values.password
      );

      if (user) {
       
        localStorage.setItem('user', JSON.stringify(user));
        
        navigate('/'); 
      } else {
        notification.error({
          message: 'Login Failed',
          description: 'Invalid email or password.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Form
        name="login"
        onFinish={onFinish}
        className="w-full max-w-sm bg-white p-8 rounded shadow-md"
      >
        <h2 className="text-2xl mb-6 text-center">Welcome</h2>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <div className="flex items-center justify-between">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className='text-gray-600'>Remember me</Checkbox>
          </Form.Item>
          <a href="/register" className="ml-2 text-blue-500">  {/* Added link */}
            Register
          </a>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full mt-3">
            Login
          </Button>
        </Form.Item>
        <Form.Item>
          <Button className="w-full bg-white text-black hover:bg-gray-200" onClick={handleBackHome}>
            Back to Home page
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
