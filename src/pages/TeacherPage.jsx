import {useState, useEffect} from "react";
import {Form, Input, InputNumber, Table, Popconfirm, message} from "antd";
import { StudentAPI } from "../api/api";
export default function TeacherPage() {
    const [form] = Form.useForm();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await TeacherAPI.getAll();
            setTeachers(response.data);
        } catch (err) {
            message.error("Error");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTeachers();
    }, []);
    const handleSubmit = async (values) => {
        try {
            await TeacherAPI.add(values);
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
    const columns = [{title: "ID", dataIndex: "id", key: "id"}, {title: "Name", dataIndex: "name", key: "name"}, {title: "Actions", key: "actions", render: (_, record) => (<Popconfirm title="Delete?" onConfirm={() => handleDelete(record.id)}><button className="deleteButton">Delete</button></Popconfirm>)}];
    return (
        <div className="container">
            <div className="formColumn">
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