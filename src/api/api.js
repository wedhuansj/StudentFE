import axios from "axios";
const API = axios.create({baseURL: "http://localhost:8081/api", headers: {"Content-Type": "application/json"}});
export const StudentAPI = {
    getAll: (page, size) => API.get(`/students?page=${page}&size=${size}`),
    add: (data) => API.post("/students", data),
    updateScore: (id, math, lit, eng) => API.put(`/students/${id}/score?m=${math}&l=${lit}&e=${eng}`),
    delete: (id) => API.delete(`/students/${id}`)
};
export const TeacherAPI = {
    getAll: () => API.get("/teachers"),
    add: (data) => API.post("/teachers", data),
    delete: (id) => API.delete(`/teachers/${id}`)
};
export const ClassroomAPI = {
    getAll: () => API.get("/classrooms"),
    add: (id, name, teacherId) => API.post(`/classrooms?id=${id}&name=${name}&tId=${teacherId}`),
    getStudents: (id) => API.get(`/classrooms/${id}/students`)
};
export const ScheduleAPI = {
    getByClass: (classId) => API.get(`/schedules/class/${classId}`),
    add: (data) => API.post("/schedules", data),
    deleteByClass: (classId) => API.delete(`/schedules/class/${classId}`)
};