import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { UserOutlined, TeamOutlined, HomeOutlined, CalendarOutlined } from "@ant-design/icons";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import ClassroomPage from "./pages/ClassroomPage";
import SchedulePage from "./pages/SchedulePage";
const { Sider, Content } = Layout;
const Sidebar = () => 
{
    const location = useLocation();
    return (
        <Sider breakpoint="lg" collapsedWidth="0" style={{ minHeight: "100vh" }}>
            <div style={{ height: 32, margin: 16, color: "white", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
                Quản lý Học đường
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={[
                    { key: "/students", icon: <UserOutlined />, label: <Link to="/students">Học sinh</Link> },
                    { key: "/teachers", icon: <TeamOutlined />, label: <Link to="/teachers">Giáo viên</Link> },
                    { key: "/classrooms", icon: <HomeOutlined />, label: <Link to="/classrooms">Lớp học</Link> },
                    { key: "/schedules", icon: <CalendarOutlined />, label: <Link to="/schedules">Lịch học</Link> },
                ]}
            />
        </Sider>
    );
};
export default function App() 
{
    return (
        <BrowserRouter>
            <Layout style={{ minHeight: "100vh" }}>
                <Sidebar />
                <Layout>
                    <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", borderRadius: 8 }}>
                        <Routes>
                            <Route path="/" element={<StudentPage />} />
                            <Route path="/students" element={<StudentPage />} />
                            <Route path="/teachers" element={<TeacherPage />} />
                            <Route path="/classrooms" element={<ClassroomPage />} />
                            <Route path="/schedules" element={<SchedulePage />} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </BrowserRouter>
    );
}