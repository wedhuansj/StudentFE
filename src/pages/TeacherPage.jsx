import { useState, useEffect, useRef } from "react";
import { Form, Input, InputNumber, Table, Popconfirm, Button, Modal, message } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { TeacherAPI } from "../api/teacher";
import { useFetch } from "../api/useFetch";
export default function TeacherPage() {
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const searchInputRef = useRef(null);
  const { data, loading, refetch } = useFetch(
    `http://localhost:8081/api/teachers?page=${currentPage - 1}&size=${pageSize}&search=${encodeURIComponent(search)}`
  );
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  const teachers = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const handleSubmit = async (v) => {
    try {
      await TeacherAPI.add(v);
      message.success("Thêm giáo viên thành công!");
      form.resetFields();
      setModalVisible(false);
      refetch();
    } catch (err) {
      message.error(err.message || "Lỗi không thể lưu giáo viên mới!");
    }
  };
  const handleDelete = async (id) => {
    try {
      await TeacherAPI.delete(id);
      message.success("Xóa giáo viên thành công!");
      refetch();
    } catch (err) {
      message.error(err.message || "Lỗi, không thể xóa giáo viên được chỉ định!");
    }
  };
  const columns = [
    { title: "Mã", dataIndex: "id", key: "id" },
    { title: "Tên giáo viên", dataIndex: "name", key: "name" },
    { title: "Tuổi", dataIndex: "age", key: "age" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Kinh nghiệm", dataIndex: "exp", key: "exp", render: (v) => `${v} năm` },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, r) => (
        <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy">
          <Button danger size="small" icon={<DeleteOutlined />}>Xóa</Button>
        </Popconfirm>
      )
    }
  ];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <Input
          ref={searchInputRef}
          style={{ width: "320px" }}
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm theo tên giáo viên"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Thêm giáo viên
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={teachers}
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
        title="Thêm giáo viên mới"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="id" label="Mã giáo viên" rules={[{ required: true, message: "Mã giáo viên không thể rỗng!" }]}><Input /></Form.Item>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: "Họ tên không được để trống!" }]}><Input /></Form.Item>
          <Form.Item name="age" label="Tuổi" rules={[{ required: true, type: "number", min: 18, message: "Tuổi giáo viên phải từ 18 tuổi trở lên!" }]}><InputNumber className="inputFullWidth" /></Form.Item>
          <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: "Vui lòng nhập giới tính!" }]}><Input /></Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}><Input /></Form.Item>
          <Form.Item name="salary" label="Lương" rules={[{ required: true, type: "number", min: 0, message: "Lương tối thiểu là 0!" }]}><InputNumber className="inputFullWidth" /></Form.Item>
          <Form.Item name="exp" label="Kinh nghiệm (năm)" rules={[{ required: true, type: "number", min: 0, message: "Kinh nghiệm tối thiểu là 0!" }]}><InputNumber className="inputFullWidth" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}