import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/dashboard";
import ManageTask from "./pages/Contact/index";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />,
      children: [
        {
          path: "/dashboard/task",
          element: <ManageTask />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
