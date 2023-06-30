/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Input, Modal, Select, Space, Tag } from "antd";
import {
  addRoleToUser,
  getRoleByUser,
  getRoles,
  getUser,
} from "@services/table";
import { log } from "console";

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

type UserItem = {
  userId: string;
  userName: string;
  phoneNumber: string;
  nickName: string;
  // updated_at: string;
};

const tagInputStyle: React.CSSProperties = {
  width: 78,
  verticalAlign: "top",
};

const TablePage: React.FC = () => {
  const [selectUser, setSelectUser] = useState();
  const columns: ProColumns<UserItem>[] = [
    {
      dataIndex: "userId",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "用户姓名",
      dataIndex: "userName",
      copyable: true,
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
    {
      title: "手机号",
      dataIndex: "phoneNumber",
      copyable: true,
      ellipsis: true,
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
      title: "用户昵称",
      dataIndex: "nickName",
      copyable: true,
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
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.userId);
          }}
        >
          编辑
        </a>,
        <a
          key="view"
          onClick={() => {
            console.log(record);
            showModal(record);
            setSelectUser(record.userId);
          }}
        >
          编辑角色
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
  const [roles, setRoles] = useState([]);
  const [selectRole, setSelectRole] = useState([]);
  const [hasRole, setHasRole] = useState([]);

  console.log("init");

  const showModal = (record: any) => {
    getRoleByUser(record.userId).then((res) => {
      setHasRole(res.data.data);
    });
    getRoles().then((res) => {
      console.log(res.data);

      const list: Array = [];
      res.data.data.forEach((item: any) => {
        list.push({
          value: item.roleId,
          label: item.roleName,
        });
      });
      setRoles(list);
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectRole([]);
    selectRole.forEach((item) => {
      addRoleToUser({
        roleId: item,
        userId: selectUser,
      });
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value: any) => {
    console.log(value);
    setSelectRole(value);
  };
  return (
    <div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Space size={[0, 8]} wrap>
          <div>拥有角色: </div>
          {hasRole.map((tag) => {
            console.log(tag);

            return (
              <Input
                key={tag}
                size="small"
                style={tagInputStyle}
                value={tag.roleName}
              />
            );
          })}
        </Space>
        <Select
          mode="tags"
          style={{ width: "100%" }}
          placeholder="Tags Mode"
          onChange={handleChange}
          options={roles}
        />
      </Modal>
      <ProTable<UserItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async () => {
          await waitTime(500);
          const res = await getUser();
          return {
            data: res.data.data.list,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: res.code === 200,
            // 不传会使用 data 的长度，如果是分页一定要传
            // total: number,
          };
        }}
        editable={{
          type: "multiple",
        }}
        rowKey="userId"
        search={{
          labelWidth: "auto",
        }}
        headerTitle="用户表格"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              actionRef.current?.reload();
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
    </div>
  );
};

export default TablePage;
