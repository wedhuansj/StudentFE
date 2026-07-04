import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
export default function Navigation()
{
    const location = useLocation();
    return (
        <Menu 
            mode="horizontal" 
            selectedKeys={[location.pathname]} 
            items={[
                { key: "/", label: <Link to="/">Dashboard</Link> }, 
                { key: "/students", label: <Link to="/students">Students</Link> }, 
                { key: "/teachers", label: <Link to="/teachers">Teachers</Link> }, 
                { key: "/classrooms", label: <Link to="/classrooms">Classrooms</Link> }, 
                { key: "/schedules", label: <Link to="/schedules">Schedules</Link> }
            ]} 
            className="navigationMenu"
        />
    );
}