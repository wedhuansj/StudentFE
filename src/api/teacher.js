const BASE = "http://localhost:8081/api/teachers";
export const TeacherAPI = {
    getAll: async () => {
        const res = await fetch(BASE);
        return { data: await res.json() };
    },
    add: async (d) => {
        const res = await fetch(BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(d)
        });
        return { data: await res.text() };
    },
    delete: async (id) => {
        const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
        return { data: await res.text() };
    }
};