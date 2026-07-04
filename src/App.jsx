import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "antd";
import Navigation from "./components/Navigation";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import ClassroomPage from "./pages/ClassroomPage";
import SchedulePage from "./pages/SchedulePage";
import "./styles/style.css";
const Dashboard = () => 
{
    const navigate = useNavigate();
    return (
        <div className="dashboardContainer">
            <h2>Dashboard</h2>
            <div className="dashboardButtonRow">
                <Button type="primary" size="large" onClick={() => navigate("/students")}>Students</Button>
                <Button type="primary" size="large" onClick={() => navigate("/teachers")}>Teachers</Button>
                <Button type="primary" size="large" onClick={() => navigate("/classrooms")}>Classrooms</Button>
                <Button type="primary" size="large" onClick={() => navigate("/schedules")}>Schedules</Button>
            </div>
        </div>
    );
};
export default function App() 
{
    return (
        <BrowserRouter>
            <div className="appWrapper">
                <Navigation />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/students" element={<StudentPage />} />
                    <Route path="/teachers" element={<TeacherPage />} />
                    <Route path="/classrooms" element={<ClassroomPage />} />
                    <Route path="/schedules" element={<SchedulePage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}