import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Button, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Displaydata = () => {
  const [allData, setAllData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: "",
    fullName: "",
    email: "",
  });
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const apiUrl =
        "https://uat-tscms.aptonline.in:8085/StudentServices/StudentRegistration/StudentDetailsList_react";
      const res = await axios.get(apiUrl);
      setAllData(res.data?.result || []);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setCurrentStudent({ ...currentStudent, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const updateUrl =
        "https://uat-tscms.aptonline.in:8085/StudentServices/StudentRegistration/UpdateStudentDetails";
      const response = await axios.post(updateUrl, currentStudent);
      if (response.data?.status === "success") {
        const updatedData = allData.map((item) =>
          item.id === currentStudent.id ? currentStudent : item
        );
        setAllData(updatedData);
        setShowModal(false);
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Update error", error);
    }
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      const deleteUrl = `https://uat-tscms.aptonline.in:8085/StudentServices/StudentRegistration/DeleteStudentDetails/${studentToDelete.id}`;
      const response = await axios.delete(deleteUrl);
      if (response.data?.status === "success") {
        setAllData(allData.filter((item) => item.id !== studentToDelete.id));
        setShowDeleteModal(false);
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const filteredData = allData.filter((item) =>
    item.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredData.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const downloadExcel = () => {
    const dataToExport = filteredData.map(({ id, fullName, email }) => ({
      ID: id,
      Name: fullName,
      Email: email,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "students.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Full Name", "Email"];
    const tableRows = filteredData.map(({ id, fullName, email }) => [
      id,
      fullName,
      email,
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("students.pdf");
  };

  return (
    <div className="container mt-4">
      <h3>Student Data</h3>

      <Form.Control
        type="text"
        placeholder="Search by full name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
        style={{ maxWidth: "300px" }}
      />

      <div className="mb-3 d-flex gap-2">
        <Button variant="success" onClick={downloadExcel}>
          Download Excel
        </Button>
        <Button variant="danger" onClick={downloadPDF}>
          Download PDF
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.length > 0 ? (
            currentPageData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="me-2"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setStudentToDelete(item);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No matching data
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
      />

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={currentStudent.fullName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentStudent.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {studentToDelete?.fullName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Displaydata;
