import { Outlet } from "react-router";

export default function Main() {
    return (
        <>
            <h1>Hello header</h1>
            <Outlet />
            <h1>Hello footer</h1>
            
        </>
    );
}
