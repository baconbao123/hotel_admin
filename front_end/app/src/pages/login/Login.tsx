import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
    { title: "Đăng nhập" },
    { name: "description", content: "Trang đăng nhập hệ thống khách sạn" }
  ];
export default function Login() {
    return (
        <>
            <h1>Login</h1>
        </>
    );
}
