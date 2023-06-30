/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Form, Input, Modal, Select, Space } from "antd";
import { getPermission, getRoles } from "@services/table";
import http from "@utils/request";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type RoleItem = {
  roleId: string;
  roleName: string;
  visible: string;
  description: string;
};

const TablePage: React.FC = () => {
  const columns: ProColumns<RoleItem>[] = [
    {
      dataIndex: "roleId",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "角色",
      dataIndex: "roleName",
      copyable: true,
      ellipsis: true,
      tip: "描述过长会自动收缩",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      disable: true,
      title: "状态",
      dataIndex: "visible",
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: "select",
      valueEnum: {
        "0": {
          text: "不可用",
          status: "Error",
        },
        "1": {
          text: "可用",
          status: "Success",
          disabled: true,
        },
      },
    },
    {
      title: "描述",
      dataIndex: "description",
      ellipsis: true,
      tip: "标题过长会自动收缩",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    // {
    //   editable: false,
    //   title: "权限标签",
    //   dataIndex: "labels",
    //   search: false,
    //   render: (_, record) => (
    //     <Space>
    //       {record.labels.map(({ name, color }) => (
    //         <Tag color={color} key={name}>
    //           {name}
    //         </Tag>
    //       ))}
    //     </Space>
    //   ),
    // },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.roleId);
          }}
        >
          编辑
        </a>,
        <a
          key="view"
          onClick={() => {
            editShow();
          }}
        >
          查看
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => action?.reload()}
          menus={[
            { key: "copy", name: "复制" },
            { key: "delete", name: "删除" },
          ]}
        />,
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectPermisson, setSelectPermisson] = useState([]);
  const [permission, setPermisson] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const editOK = () => {
    setIsEditOpen(false);
  };

  const editCancel = () => {
    setIsEditOpen(false);
  };

  const editShow = () => {
    setIsEditOpen(true);
    getPermission().then((res) => {
      const list: Array = [];
      res.data.data.forEach((item: any) => {
        list.push({
          value: item.permissionId,
          label: item.description,
        });
      });
      setPermisson(list);
    });
  };

  const addRole = (values: any) => {
    const role = {
      roleName: values.roleName,
      description: values.description,
    };
    http
      .request({
        url: "/roles",
        method: "post",
        data: role,
      })
      .then((res) => {
        console.log(res);

        handleOk();
        actionRef.current?.reload();
      });
  };

  const handleChange = (value: any) => {
    console.log(value);
    setSelectPermisson(value);
  };
  return (
    <>
      <Modal title="Basic Modal" open={isModalOpen} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={addRole}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="roleName"
            name="roleName"
            rules={[{ required: true, message: "Please input your roleName!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="description"
            name="description"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Basic Modal"
        open={isEditOpen}
        onOk={editOK}
        onCancel={editCancel}
      >
        <Space size={[0, 8]} wrap>
          <div>拥有角色: </div>
        </Space>
        <Select
          mode="tags"
          style={{ width: "100%" }}
          placeholder="Tags Mode"
          onChange={handleChange}
          options={permission}
        />
      </Modal>
      <ProTable<RoleItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async () => {
          await waitTime(500);
          const res = await getRoles();
          console.log(res);
          return {
            data: res.data.data,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: res.data.code === 200,
            // 不传会使用 data 的长度，如果是分页一定要传
            // total: number,
          };
        }}
        editable={{
          type: "multiple",
        }}
        rowKey="roleId"
        search={{
          labelWidth: "auto",
        }}
        headerTitle="角色表格"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              showModal();
            }}
            type="primary"
          >
            新建
          </Button>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: "1st item",
                  key: "1",
                },
                {
                  label: "2nd item",
                  key: "2",
                },
                {
                  label: "3rd item",
                  key: "3",
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
    </>
  );
};

export default TablePage;
