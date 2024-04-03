import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";



const AdminLayout = () => {
    const { isLogin, user } = useAppSelector(state => state.account);

    const navigate = useNavigate();

    const isAdmin = isLogin && user?.roles[0] === "admin";
    useEffect(() => {
        if (!isLogin) navigate("/login");
        if (isLogin) {
            if (user?.roles[0] != "admin") {
                navigate("/pages/403")
            }
        }
    }, [isLogin, user]);

    return (
        <>
            {isAdmin && <Outlet />}
        </>
    );
};

export default AdminLayout;