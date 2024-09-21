import { Option } from "antd/es/mentions";
import "./index.scss";
import { Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Table, } from "antd";
import { useEffect, useState } from "react";
import { Task } from "../../model/task";
import { ColumnsType } from "antd/es/table";
import moment from "moment";

function ManageTask() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const taskStatuses = ["Not Started", "In Progress", "Completed"];
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const loadTasks = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  };

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    const newTask = {
      ...values,
      id: tasks.length + 1,
      startDate: values.startDate.format("YYYY-MM-DD HH:mm:ss"),
      endDate: values.endDate.format("YYYY-MM-DD HH:mm:ss"),
    };
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    setLoading(false);
    setShowCreateModal(false);
    form.resetFields();
    setStartDate(null);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const showModal = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      startDate: moment(task.startDate),
      endDate: moment(task.endDate),
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask?.id
          ? {
              ...task,
              ...values,
              startDate: values.startDate.format("YYYY-MM-DD"),
              endDate: values.endDate.format("YYYY-MM-DD"),
            }
          : task
      );
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<Task> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      align: "center",
      render: (endDate: string) => <p style={{ color: "red" }}>{endDate}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "blue";
        if (status === "Completed") {
          color = "green";
        } else if (status === "In Progress") {
          color = "orange";
        }
        return <span style={{ color }}>{status}</span>;
      },
    },

    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <Button onClick={() => showModal(record)}>Update</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ padding: "10px" }}>
        {" "}
        <Button
          onClick={() => {
            setShowCreateModal(true);
            form.resetFields();
          }}
          style={{ background: "green", color: "white" }}
        >
          Create New Task
        </Button>
      </div>
      <Table
        dataSource={tasks}
        columns={columns}
        pagination={{ position: ["bottomCenter"] }}
      />
      <Modal
        title="Update Task"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[
              { required: true, message: "Please select the start date!" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select the end date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select>
              {taskStatuses.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        onCancel={() => setShowCreateModal(false)}
        open={showCreateModal}
        footer={[
          <Button key="back" onClick={() => setShowCreateModal(false)}>
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
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input task name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="New">
            <Select>
              <Option value="New">New</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input task description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[
                { required: true, message: "Please input start date task!" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                disabledDate={(current: moment.Moment) =>
                  current && current < moment().endOf("day")
                }
                onChange={(date) => setStartDate(date)}
              />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[
                { required: true, message: "Please input end date task!" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                disabledDate={(current: moment.Moment) =>
                  startDate ? current && current < startDate : false
                }
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageTask;
