import {useState,useEffect,useRef} from "react";
import {Form,Input,InputNumber,Table,Popconfirm,Button,Modal,message} from "antd";
import {SearchOutlined,PlusOutlined,DeleteOutlined} from "@ant-design/icons";
import {useFetch} from "../api/useFetch";
export default function SchedulePage() {
    const [form] = Form.useForm();
    const [search,setSearch] = useState("");
    const [modalVisible,setModalVisible] = useState(false);
    const [currentPage,setCurrentPage] = useState(1);
    const pageSize = 5;
    const searchInputRef = useRef(null);
    const {data,loading,refetch} = useFetch(`http://localhost:8081/api/schedules?page=${currentPage-1}&size=${pageSize}&search=${encodeURIComponent(search)}`);
    useEffect(() => {
        if(searchInputRef.current) searchInputRef.current.focus();
    }, []);
    const schedules = data?.content || [];
    const totalElements = data?.totalElements || 0;
    const handleSubmit = async (v) => {
        try {
            const res = await fetch("http://localhost:8081/api/schedules", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(v)
            });
            if(!res.ok) throw new Error("Lỗi không thể lưu lịch học!");
            message.success("Thêm lịch học thành công!");
            form.resetFields();
            setModalVisible(false);
            refetch();
        } catch(err) {
            message.error(err.message);
        }
    };
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:8081/api/schedules/${id}`, {method:"DELETE"});
            if(!res.ok) throw new Error("Lỗi xóa dữ liệu");
            message.success("Xóa lịch học thành công");
            refetch();
        } catch(err) {
            message.error(err.message);
        }
    };
    const columns = [
        {title: "Ngày", dataIndex: "day", key: "day"},
        {title: "Tiết", dataIndex: "slot", key: "slot"},
        {title: "ID môn", dataIndex: "subId", key: "subId"},
        {title: "ID giáo viên", dataIndex: "teacherId", key: "teacherId"},
        {title: "Phòng", dataIndex: "room", key: "room"},
        {title: "Hành động", key: "actions", render: (_,r) => (
            <Popconfirm title="Chắc chắn muốn xóa lịch học này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy">
                <Button type="link" danger icon={<DeleteOutlined/>}/>
            </Popconfirm>
        )}
    ];
    return (
        <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"16px"}}>
                <Input ref={searchInputRef} style={{width:"320px"}} prefix={<SearchOutlined/>} placeholder="Tìm kiếm theo mã lớp" value={search} onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}/>
                <Button type="primary" icon={<PlusOutlined/>} onClick={() => setModalVisible(true)}>Thêm lịch học</Button>
            </div>
            <Table columns={columns} dataSource={schedules} rowKey="id" loading={loading} pagination={{current:currentPage,pageSize:pageSize,total:totalElements,onChange:(p) => setCurrentPage(p)}}/>
            <Modal title="Thêm lịch học mới" open={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()} okText="Lưu lại" cancelText="Hủy">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="classId" label="Class ID" rules={[{required:true,message:"Mã lớp không thể rỗng!"}]}><Input/></Form.Item>
                    <Form.Item name="day" label="Day (2 - 8)" rules={[{required:true,type:"number",min:2,max:8,message:"Thứ từ 2 đến 8!"}]}><InputNumber className="inputFullWidth"/></Form.Item>
                    <Form.Item name="slot" label="Slot (1 - 10)" rules={[{required:true,type:"number",min:1,max:10,message:"Tiết từ 1 đến 10!"}]}><InputNumber className="inputFullWidth"/></Form.Item>
                    <Form.Item name="subId" label="Subject ID" rules={[{required:true,message:"Mã môn học bắt buộc!"}]}><Input/></Form.Item>
                    <Form.Item name="teacherId" label="Teacher ID" rules={[{required:true,message:"Mã giáo viên bắt buộc!"}]}><Input/></Form.Item>
                    <Form.Item name="room" label="Room" rules={[{required:true,message:"Phòng học bắt buộc!"}]}><Input/></Form.Item>
                </Form>
            </Modal>
        </div>
    );
}