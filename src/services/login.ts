import http from "@utils/request";
import { useNavigate } from "react-router-dom";

export async function getWexinImage() {
  return http.request({
    url: "http://116.63.167.175:8001/wxUser/wxQr",
    method: "get",
  });
}

export function askWeixinStatus(userId: any) {
  console.log("轮询");
  const navigate = useNavigate();
  const timer = setInterval(() => {
    http
      .request({
        url: "http://116.63.167.175:8001/isLogin?tempUserId=" + userId,
        method: "get",
      })
      .then((res) => {
        if (res.data.code == 200) {
          navigate("/", { replace: true });
          clearInterval(timer);
        }
      });
  }, 1000);

  // return http.request({
  //   url: 'http://127.0.0.1:3000/weixin/wxUser/wxQr',
  //   method: 'get'
  // }).then(res => {
  //   if (res.data.code != 200){
  //     askWeixinStatus()
  //   }else {
  //     // useNavigate()("/", { replace: true });
  //   }
  // })
}
