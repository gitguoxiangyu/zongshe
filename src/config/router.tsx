import React, { lazy } from "react";
import ErrorPage from "@components/ErrorPage";
import LoginPage from "../layout/components/Login";
import App, { authLoader } from "../App";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { TableOutlined, BarsOutlined, UserOutlined } from "@ant-design/icons";

// const FormPage = lazy(() => import("../pages/FormPage"));
const TablePage = lazy(() => import("../pages/TablePage"));
const AccountCenter = lazy(() => import("../pages/AccountPage/AccountCenter"));
const UserManage = lazy(() => import("../pages/UserManage"));
const AccountSettings = lazy(
  () => import("../pages/AccountPage/AccountSettings")
);
// const DetailPage = lazy(() => import("../pages/DetailPage"));

const routes = [
  {
    path: "/",
    element: <App />,
    loader: authLoader,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            path: "account",
            title: "个人页",
            icon: <UserOutlined />,
            children: [
              {
                path: "/account/center",
                title: "个人中心",
                element: <AccountCenter />,
              },
              {
                path: "/account/settings",
                title: "个人设置",
                element: <AccountSettings />,
              },
            ],
          },
          // {
          //   index: true,
          //   title: "Dashboard",
          //   icon: <DashboardOutlined />,
          //   element: <Dashboard />,
          // },
          // {
          //   path: "form",
          //   title: "表单页",
          //   icon: <EditOutlined />,
          //   element: <FormPage />,
          // },
          {
            path: "table",
            title: "角色",
            icon: <TableOutlined />,
            element: <TablePage />,
          },
          // {
          //   path: "detail",
          //   title: "详情页",
          //   icon: <BarsOutlined />,
          //   element: <DetailPage />,
          // },
          {
            path: "usermanage",
            title: "用户管理",
            icon: <BarsOutlined />,
            element: <UserManage />,
          },

          {
            path: "*",
            element: <Navigate to="/" replace={true} />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];

export { routes };

export default createBrowserRouter(routes);
