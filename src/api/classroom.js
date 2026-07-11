const BASE = "http://localhost:8081/api/classrooms";
export const ClassroomAPI = {
    getAll: async () => {
        const res = await fetch(BASE);
        return { data: await res.json() };
    },
    add: async (id, n, tId) => {
        const res = await fetch(`${BASE}?id=${id}&name=${n}&tId=${tId}`, { method: "POST" });
        return { data: await res.text() };
    },
    getStudents: async (id) => {
        const res = await fetch(`${BASE}/${id}/students`);
        return { data: await res.json() };
    }
};