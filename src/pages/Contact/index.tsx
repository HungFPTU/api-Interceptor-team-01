import "./index.scss";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { Task } from "../../model/task";
import { ColumnsType } from "antd/es/table";
function ManageTask() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

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
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
  ];

  return (
    <div>
      <Table
        dataSource={tasks}
        columns={columns}
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
}

export default ManageTask;
