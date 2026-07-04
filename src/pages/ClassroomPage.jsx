import {useState, useEffect} from "react";
import {Form, Input, Table, Modal, message} from "antd";
import { StudentAPI } from "../api/api";
export default function ClassroomPage() {
    const [form] = Form.useForm();
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [classroomStudents, setClassroomStudents] = useState([]);
    const fetchClassrooms = async () => {
        setLoading(true);
        try {
            const response = await ClassroomAPI.getAll();
            setClassrooms(response.data);
        } catch (err) {
            message.error("Error");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchClassrooms();
    }, []);
    const handleSubmit = async (values) => {
        try {
            await ClassroomAPI.add(values.id, values.name, values.headTeacherId);
            form.resetFields();
            fetchClassrooms();
        } catch (err) {
            message.error("Error");
        }
    };
    const viewStudents = async (id) => {
        try {
            const response = await ClassroomAPI.getStudents(id);
            setClassroomStudents(response.data.studentList || []);
            setModalVisible(true);
        } catch (err) {
            message.error("Error");
        }
    };
    const columns = [{title: "ID", dataIndex: "id", key: "id"}, {title: "Name", dataIndex: "name", key: "name"}, {title: "Head Teacher ID", dataIndex: "headTeacherId", key: "headTeacherId"}, {title: "Actions", key: "actions", render: (_, record) => (<button onClick={() => viewStudents(record.id)}>View Students</button>)}];
    return (
        <div className="container">
            <div className="formColumn">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="id" label="Class ID" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="name" label="Class Name" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="headTeacherId" label="Teacher ID" rules={[{required: true}]}><Input/></Form.Item>
                    <button type="submit">Save</button>
                </Form>
            </div>
            <div className="tableColumn">
                <Table columns={columns} dataSource={classrooms} rowKey="id" loading={loading}/>
            </div>
            <Modal open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
                <Table rowKey="id" dataSource={classroomStudents} columns={[{title: "ID", dataIndex: "id"}, {title: "Name", dataIndex: "name"}]}/>
            </Modal>
        </div>
    );
}