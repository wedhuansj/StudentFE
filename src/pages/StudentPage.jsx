import {useState, useEffect} from "react";
import {Form, Input, InputNumber, Select, Table, Popconfirm, message} from "antd";
import { StudentAPI } from "../api/api";
export default function StudentPage() {
    const [form] = Form.useForm();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [pagination, setPagination] = useState({current: 1, pageSize: 5, total: 0});
    const fetchStudents = async (page = 1, size = 5) => {
        setLoading(true);
        try {
            const response = await StudentAPI.getAll(page - 1, size);
            setStudents(response.data.content || []);
            setPagination({current: page, pageSize: size, total: response.data.totalElements || 0});
        } catch (err) {
            message.error("Error");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchStudents();
    }, []);
    const handleSubmit = async (values) => {
        try {
            if (isEdit) {
                await StudentAPI.updateScore(values.id, values.mathScore, values.literatureScore, values.englishScore);
            } else {
                await StudentAPI.add(values);
            }
            handleCancel();
            fetchStudents(pagination.current, pagination.pageSize);
        } catch (err) {
            message.error("Error");
        }
    };
    const handleEdit = (record) => {
        setIsEdit(true);
        form.setFieldsValue(record);
    };
    const handleDelete = async (id) => {
        try {
            await StudentAPI.delete(id);
            fetchStudents(pagination.current, pagination.pageSize);
        } catch (err) {
            message.error("Error");
        }
    };
    const handleCancel = () => {
        form.resetFields();
        setIsEdit(false);
    };
    const columns = [{title: "ID", dataIndex: "id", key: "id"}, {title: "Name", dataIndex: "name", key: "name"}, {title: "Actions", key: "actions", render: (_, record) => (<div className="actionRow"><button onClick={() => handleEdit(record)}>Edit</button><Popconfirm title="Delete?" onConfirm={() => handleDelete(record.id)}><button className="deleteButton">Delete</button></Popconfirm></div>)}];
    return (
        <div className="container">
            <div className="formColumn">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="id" label="ID" rules={[{required: true}]}><Input disabled={isEdit}/></Form.Item>
                    <Form.Item name="name" label="Name" rules={[{required: true}]}><Input disabled={isEdit}/></Form.Item>
                    <Form.Item name="classId" label="Class ID" rules={[{required: true}]}><Input disabled={isEdit}/></Form.Item>
                    {!isEdit && (
                        <>
                            <Form.Item name="age" label="Age" rules={[{required: true, type: "number", min: 11, max: 18}]}><InputNumber className="inputFullWidth"/></Form.Item>
                            <Form.Item name="gender" label="Gender" rules={[{required: true}]}><Select><Select.Option value="Male">Male</Select.Option><Select.Option value="Female">Female</Select.Option></Select></Form.Item>
                            <Form.Item name="address" label="Address" rules={[{required: true}]}><Input/></Form.Item>
                        </>
                    )}
                    <Form.Item name="mathScore" label="Math"><InputNumber min={0} max={10}/></Form.Item>
                    <Form.Item name="literatureScore" label="Literature"><InputNumber min={0} max={10}/></Form.Item>
                    <Form.Item name="englishScore" label="English"><InputNumber min={0} max={10}/></Form.Item>
                    <button type="submit">Save</button>
                    {isEdit && <button type="button" onClick={handleCancel}>Cancel</button>}
                </Form>
            </div>
            <div className="tableColumn">
                <button onClick={() => fetchStudents(pagination.current)}>Refresh</button>
                <Table columns={columns} dataSource={students} rowKey="id" loading={loading} pagination={{current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, onChange: (page, size) => fetchStudents(page, size)}}/>
            </div>
        </div>
    );
}