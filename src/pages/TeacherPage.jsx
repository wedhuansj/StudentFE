import {useState, useEffect} from "react";
import {Form, Input, InputNumber, Table, Popconfirm, message} from "antd";
import {TeacherAPI} from "../api/teacher";
export default function TeacherPage() {
    const [form] = Form.useForm();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const res = await TeacherAPI.getAll();
            setTeachers(res.data);
        } catch (err) { 
            message.error("Error");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTeachers();
    }, []);
    const handleSubmit = async (v) => {
        try {
            await TeacherAPI.add(v);
            form.resetFields();
            fetchTeachers();
        } catch (err) {
            message.error("Error");
        }
    };
    const handleDelete = async (id) => {
        try {
            await TeacherAPI.delete(id);
            fetchTeachers();
        } catch (err) {
            message.error("Error");
        }
    };
    useEffect(() => {
        console.log("key search đã thay đổi, refresh lại dữ liệu");
    }, [search]);
    const handleKeyDown = (e) => {
        setSearch(e.target.value);  
    };
    const columns = [{title: "ID", dataIndex: "id", key: "id"}, {title: "Name", dataIndex: "name", key: "name"}, {title: "Actions", key: "actions", render: (_, r) => (<Popconfirm title="Delete?" onConfirm={() => handleDelete(r.id)}><button className="deleteButton">Delete</button></Popconfirm>)}];
    return (
        <div className="container">
            <div className="formColumn">
                <label>searchbyid</label>
                <input type="text" value={search} onChange={handleKeyDown} placeholder="Press Enter to log or Escape to clear"/>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="id" label="ID" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="name" label="Name" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="age" label="Age" rules={[{required: true, type: "number", min: 1}]}><InputNumber/></Form.Item>
                    <Form.Item name="gender" label="Gender" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="address" label="Address" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="salary" label="Salary" rules={[{required: true, type: "number", min: 0}]}><InputNumber/></Form.Item>
                    <Form.Item name="exp" label="Experience" rules={[{required: true, type: "number", min: 0}]}><InputNumber/></Form.Item>
                    <button type="submit">Save</button>
                </Form>
            </div>
            <div className="tableColumn">
                <Table columns={columns} dataSource={teachers} rowKey="id" loading={loading}/>
            </div>
        </div>
    );
}