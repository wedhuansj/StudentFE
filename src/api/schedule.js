const BASE = "http://localhost:8081/api/schedules";
export const ScheduleAPI = {
    getByClass: async (id) => {
        const res = await fetch(`${BASE}/class/${id}`);
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
    deleteByClass: async (id) => {
        const res = await fetch(`${BASE}/class/${id}`, { method: "DELETE" });
        return { data: await res.text() };
    }
};