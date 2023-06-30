import http from "@utils/request";
import { faker } from "@faker-js/faker";

export async function getTable() {
  const data = new Array(10).fill(null).map(() => ({
    id: faker.string.uuid(),
    number: faker.number.int(),
    title: faker.commerce.productName(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    state: faker.helpers.arrayElement(["open", "closed", "processing"]),
    labels: new Array(faker.helpers.arrayElement([1, 2]))
      .fill(null)
      .map(() => ({
        name: faker.commerce.productAdjective(),
        color: faker.color.rgb(),
      })),
  }));
  return {
    data,
    code: 200,
  };
  // return http.request({ url: "/api/data", method: "GET" });
}

export async function getRoles() {
  return http.request({
    url: "/roles",
    method: "get",
  });
}

export async function getUser() {
  return http.request({
    url: "/user?pageNum=1&pageSize=20",
    method: "get",
  });
}

export async function getRoleByUser(userId: string) {
  return http.request({
    url: "/user-roles/" + userId,
    method: "get",
  });
}

export async function addRoleToUser(data: any) {
  return http.request({
    url: "/user-roles/",
    method: "post",
    data: data,
  });
}

export async function getPermission() {
  return http.request({
    url: "/permissions",
    method: "get",
  });
}
