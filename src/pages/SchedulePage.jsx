import {useState} from "react";
import {Form, Input, InputNumber, Table, Popconfirm, message} from "antd";
import { StudentAPI } from "../api/api";
export default function SchedulePage() {
    const [form] = Form.useForm();
    const [schedules, setSchedules] = useState([]);
    const [searchClassId, setSearchClassId] = useState("");
    const [loading, setLoading] = useState(false);
    const fetchSchedule = async (id) => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await ScheduleAPI.getByClass(id);
            setSchedules(response.data);
        } catch (err) {
            message.error("Error");
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (values) => {
        try {
            await ScheduleAPI.add(values);
            form.resetFields();
            if (values.classId == searchClassId) fetchSchedule(searchClassId);
        } catch (err) {
            message.error("Error");
        }
    };
    const handleDeleteAll = async () => {
        if (!searchClassId) return;
        try {
            await ScheduleAPI.deleteByClass(searchClassId);
            setSchedules([]);
        } catch (err) {
            message.error("Error");
        }
    };
    const columns = [{title: "Day", dataIndex: "day"}, {title: "Slot", dataIndex: "slot"}, {title: "Subject ID", dataIndex: "subId"}, {title: "Teacher ID", dataIndex: "teacherId"}];
    return (
        <div className="container">
            <div className="formColumn">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="classId" label="Class ID" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="day" label="Day (2 - 8)" rules={[{required: true, type: "number", min: 2, max: 8}]}><InputNumber/></Form.Item>
                    <Form.Item name="slot" label="Slot (1 - 10)" rules={[{required: true, type: "number", min: 1, max: 10}]}><InputNumber/></Form.Item>
                    <Form.Item name="subId" label="Subject ID" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="teacherId" label="Teacher ID" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="room" label="Room" rules={[{required: true}]}><Input/></Form.Item>
                    <button type="submit">Save</button>
                </Form>
            </div>
            <div className="tableColumn">
                <input value={searchClassId} onChange={(e) => setSearchClassId(e.target.value)}/>
                <button onClick={() => fetchSchedule(searchClassId)}>Search</button>
                {schedules.length > 0 && (<Popconfirm title="Delete all?" onConfirm={handleDeleteAll}><button>Delete All</button></Popconfirm>)}
                <Table columns={columns} dataSource={schedules} rowKey={(record) => `${record.day}-${record.slot}`} loading={loading}/>
            </div>
        </div>
    );
}