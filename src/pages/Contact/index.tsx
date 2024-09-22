import { Option } from "antd/es/mentions";
import "./index.scss";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Popconfirm,
  Tag,
} from "antd";

import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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
  const [startHour, setStartHour] = useState<number>(moment().hour());

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
    setStartHour(moment().hour())
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

  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  };

  const handleStatusChange = (id: number, status: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status } : task
    );
    saveTasks(updatedTasks);
  };

  const handleOk = () => {
    form.validateFields().then((values: any) => {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask?.id
          ? {
            ...task,
            ...values,
            startDate: values.startDate.format("YYYY-MM-DD HH:mm:ss"),
            endDate: values.endDate.format("YYYY-MM-DD HH:mm:ss"),
          }
          : task
      );
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setIsModalVisible(false);
      setStartDate(null)
      setStartHour(moment().hour())

    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setStartDate(null)
    setStartHour(moment().hour())

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
      render: (status: string, record: Task) => (
        <Select
          className="select"
          style={{ border: "none", width: "100%" }}
          defaultValue={status}
          onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
        >
          <Option value="New">
            <Tag
              style={{
                width: "100px",
                textAlign: "center",
                fontSize: "15px",
              }}
              icon={<ExclamationCircleOutlined />}
              color="warning"
            >
              New
            </Tag>
          </Option>
          <Option value="In Progress">
            <Tag
              style={{
                width: "130px",
                textAlign: "center",
                fontSize: "15px",
              }}
              icon={<SyncOutlined spin />}
              color="processing"
            >
              In Progress
            </Tag>
          </Option>
          <Option value="Completed">
            <Tag
              style={{
                width: "120px",
                textAlign: "center",
                fontSize: "15px",
              }}
              icon={<CheckCircleOutlined />}
              color="success"
            >
              Completed
            </Tag>
          </Option>
        </Select>
      ),
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

    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (id: number) => (
        <div style={{ textAlign: "center" }}>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => handleDeleteTask(id)}
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
                // disabledDate={(current) => {
                //   const momentCurrent = moment(current.toDate()); // Convert Dayjs to Moment
                //   return startDate ? momentCurrent && momentCurrent < startDate.startOf("day") : false;
                // }}

                onChange={(date) => {
                  setStartDate(date ? moment(date.toDate()) : null);
                  if (date) {
                    setStartHour(moment(date.toDate()).hour()); // Update startHour if date is selected
                  }
                }
                }
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
                disabledDate={(current) => {
                  const momentCurrent = moment(current.toDate());
                  // Disable dates before today
                  return startDate ? momentCurrent && momentCurrent < startDate.startOf("day") : false;
                }}
                disabledTime={(current) => {
                  const momentCurrent = moment(current.toDate());
                  const disabledHours = momentCurrent.isSame(moment(), 'day')
                    ? Array.from({ length: momentCurrent.hour() }, (_, i) => i) // Disable hours strictly before the current hour
                    : [];

                  // Additionally, disable times before one hour after startDate's hour only if on the same day
                  if (momentCurrent.isSame(startDate, 'day')) {
                    disabledHours.push(...Array.from({ length: startHour + 1 }, (_, i) => i));
                  }

                  return {
                    disabledHours: () => disabledHours,
                    disabledMinutes: () => [],
                    disabledSeconds: () => [],
                  };
                }}
              // onChange={(date) => setEndDate(date ? moment(date.toDate()) : null)}

              />
            </Form.Item>
          </div>
          {/* //============================================================================ */}

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
        onCancel={() => {
          setShowCreateModal(false)
          setStartDate(null)
          setStartHour(moment().hour())

        }}
        open={showCreateModal}
        footer={[
          <Button key="back" onClick={() => {
            setShowCreateModal(false)
            setStartDate(null)

          }}>
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
                // disabledDate={(current) => {
                //   const momentCurrent = moment(current.toDate()); // Convert Dayjs to Moment
                //   return startDate ? momentCurrent && momentCurrent < startDate.startOf("day") : false;
                // }}

                onChange={(date) => {
                  setStartDate(date ? moment(date.toDate()) : null);
                  if (date) {
                    setStartHour(moment(date.toDate()).hour()); // Update startHour if date is selected
                  }
                }
                }
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
                disabledDate={(current) => {
                  const momentCurrent = moment(current.toDate());
                  // Disable dates before today
                  return startDate ? momentCurrent && momentCurrent < startDate.startOf("day") : false;
                }}
                disabledTime={(current) => {
                  const momentCurrent = moment(current.toDate());
                  const disabledHours = momentCurrent.isSame(moment(), 'day')
                    ? Array.from({ length: momentCurrent.hour() }, (_, i) => i) // Disable hours strictly before the current hour
                    : [];

                  // Additionally, disable times before one hour after startDate's hour only if on the same day
                  if (momentCurrent.isSame(startDate, 'day')) {
                    disabledHours.push(...Array.from({ length: startHour + 1 }, (_, i) => i));
                  }

                  return {
                    disabledHours: () => disabledHours,
                    disabledMinutes: () => [],
                    disabledSeconds: () => [],
                  };
                }}
              // onChange={(date) => setEndDate(date ? moment(date.toDate()) : null)}

              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageTask;
