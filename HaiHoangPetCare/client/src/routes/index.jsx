/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { Route, Navigate } from "react-router-dom";
// trang chính
import Home from "../pages/Home";
import HomePage from "../pages/Home/HomePage";
import AboutPage from "../pages/Home/AboutPage"
import ProductPage from "../pages/Home/ProductPage";
import AdvisePage from "../pages/Home/AdvisePage";
import NewsPage from "../pages/Home/NewsPage";
import LoginPage from "../pages/Home/LoginPage";
import RegisterPage from "../pages/Home/RegisterPage";
import UserPage from "../pages/Home/UserPage";
import ServicePage from "../pages/Home/ServicePage";
import ProductDetailPage from "../pages/Home/ProductDetailPage";

//trang quản lý
import Admin from "../pages/Admin";
import AdminPage from "../pages/Admin/AdminPage";

const routes = [
    {
        path: "/",
        Element: Home,
        nested: [
            {
                index: true,
                element: HomePage,
            },
            {
                path: "gioi-thieu",
                element: AboutPage,
            },
            {
                path: "san-pham",
                element: ProductPage,
            },
            {
                path: "san-pham/:id",
                element: ProductDetailPage,
            },
            {
                path: "tu-van",
                element: AdvisePage,
            },
            {
                path: "tin-tuc",
                element: NewsPage,
            },
            {
                path: "dang-nhap",
                element: LoginPage,
            },
            {
                path: "dang-ky",
                element: RegisterPage,
            },
            {
                path: "nguoi-dung",              
                element: RedirectToUser,
            },
            {
                path: "nguoi-dung/:fullname",   
                element: UserPage,
            },
            {
                path: "dich-vu",   
                element: ServicePage,
            },

        ],
    },
    {
        path: "admin",
        Element: AdminRouteWrapper(Admin),
        nested: [
            {
                index: true,
                element: AdminPage,
            },
        ],
    },
    // {
    //     path: "auth",
    //     Element: AuthPage,
    // },
];

//chặn vào trang admin nếu ko phải là admin
function AdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.Role !== "BS") {
        alert("Bạn không có quyền truy cập trang này!");
        return <Navigate to="/" replace />;
    }
    return children;
}
function AdminRouteWrapper(Component) {
    return function ProtectedAdmin() {
        return (
            <AdminRoute>
                <Component />
            </AdminRoute>
        );
    };
}

// chỉnh tên đường dẫn ko dấu + space = "-"
function toSlug(s) {
    return (s || "")
        .toString()
        .normalize("NFD")                       // tách dấu
        .replace(/[\u0300-\u036f]/g, "")        // bỏ dấu
        .replace(/[^a-zA-Z0-9\s-]/g, "")        // bỏ ký tự đặc biệt
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")                   
        .replace(/-+/g, "-");                   
}
// hiện tên người dùng trong đường dẫn
function RedirectToUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return <Navigate to="/dang-nhap" replace />;
    const fullname = user.Fullname || user.FullName || "";
    const slug = toSlug(fullname);
    return <Navigate to={`/nguoi-dung/${slug}`} replace />;
}

// hàm tạo routes
export const generateRoutes = () => {
    return routes.map((route) => {
        if (route.nested) {
            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<route.Element />}
                >
                    {route.nested.map((item) =>
                        item.index ? (
                            <Route key="index" index element={<item.element />} />
                        ) : (
                            <Route
                                key={item.path}
                                path={item.path}
                                element={<item.element />}
                            />
                        )
                    )}
                </Route>
            );
        } else {
            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<route.Element />}
                />
            );
        }
    });
};
