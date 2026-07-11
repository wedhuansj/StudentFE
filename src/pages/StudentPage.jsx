import {useState, useEffect} from "react";
import {Form, Input, InputNumber, Select, Table, Popconfirm, Upload, Button, message} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {StudentAPI} from "../api/student";
export default function StudentPage() {
    const [form] = Form.useForm();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [keySearch, setKeySearch] = useState("");
    const [pagination, setPagination] = useState({current: 1, pageSize: 5, total: 0});
    const fetchStudents = async (p = 1, s = 5, q = "") => {
        setLoading(true);
        try {
            const res = await StudentAPI.getAll(p - 1, s, q);
            setStudents(res.data.content || []);
            setPagination({current: p, pageSize: s, total: res.data.totalElements || 0});
        } catch (err) {
            message.error("Error");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchStudents(1, pagination.pageSize, keySearch);
    }, [keySearch]);
    const handleSubmit = async (v) => {
        try {
            if (isEdit) {
                await StudentAPI.updateScore(v.id, v.mathScore, v.literatureScore, v.englishScore);
            } else {
                await StudentAPI.add(v);
            }
            handleCancel();
            fetchStudents(pagination.current, pagination.pageSize, keySearch);
        } catch (err) {
            message.error("Error");
        }
    };
    const handleUpload = async (id, file) => {
        try {
            await StudentAPI.uploadAvatar(id, file);
            message.success("Success");
            fetchStudents(pagination.current, pagination.pageSize, keySearch);
        } catch (err) {
            message.error("Error");
        }
        return false;
    };
    const handleEdit = (r) => {
        setIsEdit(true);
        form.setFieldsValue(r);
    };
    const handleDelete = async (id) => {
        try {
            await StudentAPI.delete(id);
            fetchStudents(pagination.current, pagination.pageSize, keySearch);
        } catch (err) {
            message.error("Error");
        }
    };
    const handleCancel = () => {
        form.resetFields();
        setIsEdit(false);
    };
    const columns = [
        {title: "ID", dataIndex: "id", key: "id"}, 
        {title: "Name", dataIndex: "name", key: "name"}, 
        {
            title: "Actions", 
            key: "actions", 
            render: (_, r) => (
                <div className="actionRow">
                    <button onClick={() => handleEdit(r)}>Edit</button>
                    <Popconfirm title="Delete?" onConfirm={() => handleDelete(r.id)}>
                        <button className="deleteButton">Delete</button>
                    </Popconfirm>
                    <Upload beforeUpload={(f) => handleUpload(r.id, f)} showUploadList={false}>
                        <Button size="small" icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </div>
            )
        }
    ];
    return (
        <div className="container">
            <div className="formColumn">
                <div className="searchRow">
                    <Input value={keySearch} onChange={(e) => setKeySearch(e.target.value)} placeholder="Search student..."/>
                </div>
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
                <button onClick={() => fetchStudents(pagination.current, pagination.pageSize, keySearch)}>Refresh</button>
                <Table columns={columns} dataSource={students} rowKey="id" loading={loading} pagination={{current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, onChange: (p, s) => fetchStudents(p, s, keySearch)}}/>
            </div>
        </div>
    );
}