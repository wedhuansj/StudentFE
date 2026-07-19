import { useState, useEffect, useRef, useMemo } from "react";
import { Form, Input, InputNumber, Select, Table, Popconfirm, Upload, Button, Modal, Card, Col, Row, Tag, message } from "antd";
import { UploadOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useFetch } from "../api/useFetch";
export default function StudentPage() {
    const [form] = Form.useForm();
    const [keySearch, setKeySearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const searchInputRef = useRef(null);
    const { data, loading, refetch } = useFetch(`http://localhost:8081/api/students?page=${currentPage-1}&size=${pageSize}&search=${encodeURIComponent(keySearch)}`);
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);
    const students = data?.content || [];
    const totalElements = data?.totalElements || 0;
    const stats = useMemo(() => {
        let giois = 0, khas = 0, tbs = 0, yeus = 0;
        students.forEach((student) => {
            const gpa = (student.mathScore + student.literatureScore + student.englishScore) / 3.0;
            if (gpa >= 8.0) giois++;
            else if (gpa >= 6.5) khas++;
            else if (gpa >= 5.0) tbs++;
            else yeus++;
        });
        return { giois, khas, tbs, yeus };
    }, [students]);
    const handleSubmit = async (v) => {
        try {
            let res;
            if (isEdit) {
                res = await fetch(`http://localhost:8081/api/students/${v.id}/score`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        mathScore: v.mathScore,
                        literatureScore: v.literatureScore,
                        englishScore: v.englishScore
                    })
                });
                if (!res.ok) throw new Error("Lỗi cập nhật điểm!");
                message.success("Cập nhật điểm thành công");
            } 
            else {
                res = await fetch("http://localhost:8081/api/students", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(v)
                });
                if (!res.ok) throw new Error("Lỗi thêm học sinh mới!");
                message.success("Thêm học sinh thành công");
            }
            handleCancel();
            refetch();
        } 
        catch (err) {
            message.error(err.message);
        }
    };
    const handleUpload = async (id, file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch(`http://localhost:8081/api/students/${id}/avatar`, {
                method: "POST",
                body: formData
            });
            if (!res.ok) throw new Error("Lỗi tải ảnh đại diện!");
            message.success("Tải lên ảnh thành công");
            refetch();
        } 
        catch (err) {
            message.error(err.message);
        }
        return false;
    };
    const handleEdit = (r) => {
        setIsEdit(true);
        form.setFieldsValue(r);
        setModalVisible(true);
    };
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:8081/api/students/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Không thể xóa học sinh này!");
            message.success("Xóa học sinh thành công");
            refetch();
        } 
        catch (err) {
            message.error(err.message);
        }
    };
    const handleCancel = () => {
        form.resetFields();
        setIsEdit(false);
        setModalVisible(false);
    };
    const columns = [{
            title: "Ảnh",
            key: "avatar",
            width: 80,
            render: (_, r) => 
            {
                const avatarUrl = `http://localhost:8081/api/students/${r.id}/avatar`;
                return (
                    <img
                        src={avatarUrl}
                        alt="avatar"
                        className="avatarImg"
                        onError={(e) => 
                        {
                            e.target.onerror = null;
                            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${r.name}`;
                        }}
                    />
                );
            }
        },
        { title: "Mã", dataIndex: "id", key: "id" },
        { title: "Họ tên", dataIndex: "name", key: "name" },
        { title: "Toán", dataIndex: "mathScore", key: "mathScore" },
        { title: "Văn", dataIndex: "literatureScore", key: "literatureScore" },
        { title: "Anh", dataIndex: "englishScore", key: "englishScore" },
        {
            title: "GPA",
            key: "gpa",
            render: (_, r) => 
            {
                const gpa = (r.mathScore + r.literatureScore + r.englishScore) / 3.0;
                return <b>{gpa.toFixed(2)}</b>;
            }
        },
        {
            title: "Xếp loại",
            key: "rank",
            render: (_, r) => 
            {
                const gpa = (r.mathScore + r.literatureScore + r.englishScore) / 3.0;
                if (gpa >= 8.0) return <Tag color="success">Giỏi</Tag>;
                if (gpa >= 6.5) return <Tag color="processing">Khá</Tag>;
                if (gpa >= 5.0) return <Tag color="warning">Trung bình</Tag>;
                return <Tag color="error">Yếu</Tag>;
            }
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, r) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button type="primary" ghost size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)}>Sửa</Button>
                    <Popconfirm title="Chắc chắn muốn xóa học sinh này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy">
                        <Button danger size="small" icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                    <Upload beforeUpload={(f) => handleUpload(r.id, f)} showUploadList={false}>
                        <Button size="small" icon={<UploadOutlined />}>Ảnh</Button>
                    </Upload>
                </div>
            )
        }
    ];
    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col xs={12} sm={6}>
                    <Card bordered={false}>
                        <div style={{ color: "#8c8c8c" }}>Học sinh Giỏi</div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}>{stats.giois}</div>
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card bordered={false}>
                        <div style={{ color: "#8c8c8c" }}>Học sinh Khá</div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>{stats.khas}</div>
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card bordered={false}>
                        <div style={{ color: "#8c8c8c" }}>Học sinh TB</div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#faad14" }}>{stats.tbs}</div>
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card bordered={false}>
                        <div style={{ color: "#8c8c8c" }}>Học sinh Yếu</div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f5222d" }}>{stats.yeus}</div>
                    </Card>
                </Col>
            </Row>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <Input
                    ref={searchInputRef}
                    style={{ width: "320px" }}
                    prefix={<SearchOutlined />}
                    placeholder="Tìm kiếm theo tên HS"
                    value={keySearch}
                    onChange={(e) => 
                    {
                        setKeySearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                    Thêm học sinh
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={students}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalElements,
                    onChange: (p) => setCurrentPage(p)
                }}
            />
            <Modal
                title={isEdit ? "Sửa điểm học sinh" : "Thêm mới học sinh"}
                open={modalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText="Lưu lại"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="id" label="Mã học sinh" rules={[{ required: true, message: "Không được bỏ trống mã!" }]}><Input disabled={isEdit} /></Form.Item>
                    <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: "Vui lòng điền tên học sinh!" }]}><Input disabled={isEdit} /></Form.Item>
                    {!isEdit && (
                        <>
                            <Form.Item name="classId" label="Mã lớp học" rules={[{ required: true, message: "Vui lòng nhập mã lớp!" }]}><Input /></Form.Item>
                            <Form.Item name="age" label="Tuổi" rules={[{ required: true, type: "number", min: 11, max: 18, message: "Tuổi từ 11 đến 18!" }]}><InputNumber className="inputFullWidth" /></Form.Item>
                            <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: "Chọn giới tính!" }]}><Select placeholder="Chọn giới tính"><Select.Option value="Male">Nam</Select.Option><Select.Option value="Female">Nữ</Select.Option></Select></Form.Item>
                            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Nhập địa chỉ học sinh!" }]}><Input /></Form.Item>
                        </>
                    )}
                    <Form.Item name="mathScore" label="Điểm toán" rules={[{ required: true, message: "Nhập điểm toán!" }]}><InputNumber min={0} max={10} step={0.25} className="inputFullWidth" /></Form.Item>
                    <Form.Item name="literatureScore" label="Điểm văn" rules={[{ required: true, message: "Nhập điểm văn!" }]}><InputNumber min={0} max={10} step={0.25} className="inputFullWidth" /></Form.Item>
                    <Form.Item name="englishScore" label="Điểm anh" rules={[{ required: true, message: "Nhập điểm anh!" }]}><InputNumber min={0} max={10} step={0.25} className="inputFullWidth" /></Form.Item>
                </Form>
            </Modal>
        </div>
    );
}