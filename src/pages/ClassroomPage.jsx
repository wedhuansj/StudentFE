import {useState,useEffect,useRef} from "react";
import {Form,Input,Table,Modal,Button,message} from "antd";
import {SearchOutlined,PlusOutlined,EyeOutlined} from "@ant-design/icons";
import {useFetch} from "../api/useFetch";
export default function ClassroomPage() {
    const [form] = Form.useForm();
    const [search,setSearch] = useState("");
    const [modalVisible,setModalVisible] = useState(false);
    const [studentsVisible,setStudentsVisible] = useState(false);
    const [classroomStudents,setClassroomStudents] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const pageSize = 5;
    const searchInputRef = useRef(null);
    const {data,loading,refetch} = useFetch(`http://localhost:8081/api/classrooms?page=${currentPage-1}&size=${pageSize}&search=${encodeURIComponent(search)}`);
    useEffect(() => {
        if(searchInputRef.current) searchInputRef.current.focus();
    }, []);
    const classrooms = data?.content || [];
    const totalElements = data?.totalElements || 0;
    const handleSubmit = async (v) => {
        try {
            const res = await fetch("http://localhost:8081/api/classrooms", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({id:v.id,name:v.name,headTeacherId:v.headTeacherId})
            });
            if(!res.ok) throw new Error("Lỗi không thể lưu lớp học!");
            message.success("Thêm lớp học thành công!");
            form.resetFields();
            setModalVisible(false);
            refetch();
        } catch(err) {
            message.error(err.message);
        }
    };
    const viewStudents = async (id) => {
        try {
            const res = await fetch(`http://localhost:8081/api/classrooms/${id}/students`);
            if(!res.ok) throw new Error("Không thể tải danh sách học sinh");
            const resData = await res.json();
            setClassroomStudents(resData.students || []); 
            setStudentsVisible(true);
        } catch(err) {
            message.error(err.message);
        }
    };
    const columns = [
        {title: "ID", dataIndex: "id", key: "id"},
        {title: "Tên", dataIndex: "name", key: "name"},
        {title: "ID chủ nhiệm", dataIndex: "headTeacherId", key: "headTeacherId"},
        {title: "Hành động", key: "actions", render: (_,r) => (
            <Button type="primary" ghost size="small" icon={<EyeOutlined/>} onClick={() => viewStudents(r.id)}>View Students</Button>
        )}
    ];
    return (
        <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"16px"}}>
                <Input ref={searchInputRef} style={{width:"320px"}} prefix={<SearchOutlined/>} placeholder="Tìm kiếm theo tên lớp" value={search} onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}/>
                <Button type="primary" icon={<PlusOutlined/>} onClick={() => setModalVisible(true)}>Thêm lớp học</Button>
            </div>
            <Table columns={columns} dataSource={classrooms} rowKey="id" loading={loading} pagination={{current:currentPage,pageSize:pageSize,total:totalElements,onChange:(p) => setCurrentPage(p)}}/>
            <Modal title="Thêm lớp học mới" open={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()} okText="Lưu lại" cancelText="Hủy">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="id" label="Class ID" rules={[{required:true,message:"Mã lớp không thể rỗng!"}]}><Input/></Form.Item>
                    <Form.Item name="name" label="Class Name" rules={[{required:true,message:"Tên lớp không được trống!"}]}><Input/></Form.Item>
                    <Form.Item name="headTeacherId" label="Teacher ID" rules={[{required:true,message:"Vui lòng điền ID giáo viên!"}]}><Input/></Form.Item>
                </Form>
            </Modal>
            <Modal title="Danh sách học sinh" open={studentsVisible} onCancel={() => setStudentsVisible(false)} footer={null}>
                <Table rowKey="id" dataSource={classroomStudents} columns={[{title:"ID",dataIndex:"id"},{title:"Name",dataIndex:"name"}]}/>
            </Modal>
        </div>
    );
}