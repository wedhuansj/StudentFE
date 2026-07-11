const URL = "http://localhost:8081/api/students";
export const StudentAPI = {
    getAll: async (page, size, keySearch = "") => {
        const res = await fetch(`${URL}?page=${page}&size=${size}&search=${encodeURIComponent(keySearch)}`);
        return { data: await res.json() };
    },
    add: async (data) => {
        const res = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return { data: await res.text() };
    },
    updateScore: async (id, scoreDTO) => {
        const res = await fetch(`${URL}/${id}/score`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(scoreDTO)
        });
        return { data: await res.text() };
    },
    uploadAvatar: async (id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${URL}/${id}/avatar`, {
            method: "POST",
            body: formData
        });
        return { data: await res.json() };
    },
    delete: async (id) => {
        const res = await fetch(`${URL}/${id}`, { method: "DELETE" });
        return { data: await res.text() };
    }
};