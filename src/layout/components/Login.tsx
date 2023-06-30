import React, { useEffect, useRef, useState } from "react";
import {
  WechatOutlined,
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  LoginFormPage,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormInstance,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Divider, message, Modal, Space, Tabs } from "antd";
import type { CSSProperties } from "react";
import { useLoginStore } from "@stores/index";
import http from "@utils/request";
import { getWexinImage } from "@services/login";

type LoginType = "phone" | "account";

const iconStyles: CSSProperties = {
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "18px",
  verticalAlign: "middle",
  cursor: "pointer",
};

const Login = () => {
  const [loginType, setLoginType] = useState<LoginType>("account");
  const [codeImg, setCodeImg] = useState<string>("");
  const { setUserInfo } = useLoginStore();
  const navigate = useNavigate();
  // 表单实例
  const formRef = useRef<ProFormInstance>();

  const [uuid, setUuid] = useState<string>("");
  const [tempKey, setTempKey] = useState<string>("");
  console.log(666);
  console.log(uuid);

  // 踩坑：useEffect第一个参数不能是异步函数，如果是，则该函数隐式返回一个 Promise 对象，该对象被 React 框架错误地解释为返回的清理函数。当组件由于导航而卸载时，这会导致错误
  useEffect(() => {
    http
      .request({
        url: "/captchaImage",
        method: "get",
      })
      .then((res) => {
        console.log(res);
        setCodeImg("data:image/gif;base64," + res.data.data.img);
        // console.log(res.data.data.uuid);
        setUuid(res.data.data.uuid);
        console.log(uuid);
      });
  }, []); //重点

  const onFinish = async (values: any) => {
    if (loginType == "phone") {
      const registerIdentify = {
        phoneNumber: values.mobile,
        password: values.password,
        nickName: values.username,
        gender: "男",
        age: "21",
      };
      const infoIdentify = {
        code: values.captcha,
        tempKey: tempKey,
      };
      await http
        .request({
          url: "http://116.63.167.175:9520/user/verifyCode",
          method: "post",
          data: infoIdentify,
        })
        .then((res) => {
          message.success(res.data.message);
          if (res.data.code != 200) {
            return Promise.reject();
          }
        });
      await http
        .request({
          url: "http://116.63.167.175:9520/user/register",
          method: "post",
          data: registerIdentify,
        })
        .then((res) => {
          console.log(res);
          message.success(res.data.message);
        });
    } else {
      const loginIdentify = {
        userName: values.username,
        password: values.password,
      };
      const codeIdentify = {
        uuid: uuid,
        codeOfUser: values.code,
      };

      const login = http.request({
        url: "/user/login",
        method: "post",
        data: loginIdentify,
      });
      const identifyCode = http.request({
        url: "/captchaImage",
        method: "post",
        data: codeIdentify,
      });

      Promise.all([login, identifyCode]).then((res) => {
        console.log(res);
        if (res[0].data.code != 200 && res[1].data.code == 200) {
          message.success("登录成功🎉🎉🎉");
          setUserInfo(values);
          navigate("/", { replace: true });
        }
      });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wexinImg, setWexinImg] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
    getWexinImage().then((res) => {
      setWexinImg(res.data.data.qrUrl);
      // askWeixinStatus(res.data.data.tempUserId)
      console.log("轮询");
      const timer = setInterval(() => {
        http
          .request({
            url:
              "http://116.63.167.175:8001/wxUser/isLogin?tempUserId=" +
              res.data.data.tempUserId,
            method: "get",
          })
          .then((res) => {
            if (res.data.code == 200) {
              setUserInfo(res.data.data);
              navigate("/", { replace: true });
              clearInterval(timer);
            }
          });
      }, 1000);
    });
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <img src={wexinImg} alt="微信登录" />
      </Modal>
      <LoginFormPage
        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
        onFinish={onFinish as any}
        formRef={formRef}
        title="权限管理系统"
        subTitle="一个可复用的用户权限管理系统"
        activityConfig={{
          style: {
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
            color: "#fff",
            borderRadius: 8,
            backgroundColor: "#1677FF",
          },
          title: "管理系统",
          subTitle: "",
          action: (
            <Button
              size="large"
              style={{
                borderRadius: 20,
                background: "#fff",
                color: "#1677FF",
                width: 120,
              }}
            >
              去看看
            </Button>
          ),
        }}
        actions={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Divider plain>
              <span
                style={{ color: "#CCC", fontWeight: "normal", fontSize: 14 }}
              >
                其他登录方式
              </span>
            </Divider>
            <Space align="center" size={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: 40,
                  width: 40,
                  border: "1px solid #D4D8DD",
                  borderRadius: "50%",
                }}
              >
                <WechatOutlined
                  style={{ ...iconStyles, color: "green" }}
                  onClick={showModal}
                />
              </div>
            </Space>
          </div>
        }
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={"account"} tab={"账号密码登录"} />
          <Tabs.TabPane key={"phone"} tab={"手机号注册"} />
        </Tabs>
        {loginType === "account" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"用户名: admin or user"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"密码: 123456"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />
            <ProFormText
              name="code"
              fieldProps={{
                size: "small",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"验证码"}
              rules={[
                {
                  required: true,
                  message: "请输入验证码!",
                },
              ]}
            />
            <img src={codeImg} alt="验证码" />
          </>
        )}
        {loginType === "phone" && (
          <>
            <ProFormText
              fieldProps={{
                size: "large",
                prefix: <MobileOutlined className={"prefixIcon"} />,
              }}
              name="mobile"
              placeholder={"手机号"}
              rules={[
                {
                  required: true,
                  message: "请输入手机号！",
                },
                {
                  pattern: /^1\d{10}$/,
                  message: "手机号格式错误！",
                },
              ]}
            />
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"用户名: admin or user"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"密码: 123456"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              captchaProps={{
                size: "large",
              }}
              placeholder={"请输入验证码"}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${"获取验证码"}`;
                }
                return "获取验证码";
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: "请输入验证码！",
                },
              ]}
              onGetCaptcha={async () => {
                // message.success("获取验证码成功！验证码为：1234");
                const phoneNumber = formRef?.current?.getFieldValue("mobile");
                http
                  .request({
                    url: "http://116.63.167.175:9520/user/sendCode",
                    method: "post",
                    data: {
                      phoneNumber,
                    },
                  })
                  .then((res) => {
                    setTempKey(res.data.data);
                  });
              }}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: "right",
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default Login;
