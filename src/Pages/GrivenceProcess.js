import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Tooltip as MuiTooltip } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaExclamationCircle, FaCheckCircle, FaLayerGroup } from "react-icons/fa";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE = "https://uat-tscms.aptonline.in:8085/FacultyserviceN/Facultyregistration";

const cardStyle = {
  cursor: "pointer",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
  backgroundColor: "white",
  transition: "transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease",
};

const animatedHover = {
  transform: "translateY(-10px) scale(1.05) rotateX(3deg)",
  boxShadow: "0 10px 20px rgba(0, 123, 255, 0.4)",
  filter: "drop-shadow(0 0 8px rgba(0, 123, 255, 0.6))",
  zIndex: 10,
};

const GrievanceProcess = () => {
  const [pendingCounts, setPendingCounts] = useState({ L1: 0, L2: 0, L3: 0 });
  const [resolvedCounts, setResolvedCounts] = useState({ L1: 0, L2: 0, L3: 0 });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [grievanceData, setGrievanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [actionOptions, setActionOptions] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState("");


  const [levelflag,setlevelflag]=useState(null);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "grievanceeID",
      headerName: "Grievance ID",
      width: 150,
      renderCell: (params) => (
        <span
          style={{
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => fetchGrievanceById(params.value)}
        >
          {params.value}
        </span>
      ),
    },
    { field: "gritype", headerName: "Type", width: 180 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "dateofsubmission", headerName: "Date of Request", width: 160 },
    { field: "griDescription", headerName: "Description", width: 280 },
  ];

  useEffect(() => {
    const userid = sessionStorage.getItem("userid");

    fetch(
      `https://uat-tscms.aptonline.in:8085/MasterServices/master/Master_grievancetypes_populate_processaction?userid=${sessionStorage.getItem("userId")}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200 && data.result) {
          setActionOptions(data.result);
        }
      })
      .catch((err) => console.error("Failed to fetch action options:", err));
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const pendingRes = await fetch(
          `${API_BASE}/grivence_pending_count?Userid=S0297`
        );
        const pendingJson = await pendingRes.json();
        if (pendingJson.code === 200 && pendingJson.result.length > 0) {
          const res = pendingJson.result[0];
          
            setlevelflag(res.level_check);
          sessionStorage.setItem('levelcheck', res.Level_check);
          setPendingCounts({
            L1: parseInt(res.grivence_L1_COUNT) || 0,
            L2: parseInt(res.grivence_L2_COUNT) || 0,
            L3: parseInt(res.grivence_L3_COUNT) || 0,
          });
        }

        const resolvedRes = await fetch(
          `${API_BASE}/grivence_Rresolved_count?Userid=S0297`
        );
        const resolvedJson = await resolvedRes.json();
        if (resolvedJson.code === 200 && resolvedJson.result.length > 0) {
          const res = resolvedJson.result[0];
          setResolvedCounts({
            L1: parseInt(res.grivence_L1_Resolved_COUNT) || 0,
            L2: parseInt(res.grivence_L2_Resolved_COUNT) || 0,
            L3: parseInt(res.grivence_L3_Resolved_COUNT) || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    }
    fetchCounts();
  }, []);

  const fetchGrievanceData = async (level, status) => {
    setLoading(true);
    let url = "";
    if (status === "Pending") {
      url = `${API_BASE}/sp_student_grievance_details_select_levelbase?Userid=S0297&levelid=${level}`;
    } else if (status === "Resolved") {
      url = `${API_BASE}/sp_student_grievance_details_select_levelbase_approved?Userid=S0297&levelid=${level.toLowerCase()}`;
    }
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.code === 200 && json.result) {
        const rows = json.result.map((item, idx) => ({
          id: idx + 1,
          ...item,
        }));
        setGrievanceData(rows);
      } else {
        setGrievanceData([]);
      }
    } catch (error) {
      console.error("Error fetching grievance data:", error);
      setGrievanceData([]);
    }
    setLoading(false);
  };

  const onCardClick = (level, status) => {
    setSelectedLevel(level);
    setSelectedStatus(status);
    fetchGrievanceData(level, status);
  };

// const checkvalidPerson=async (sessionStorage.getItem("userId"))=>{

// try
// {
//  axios
//       .post('https://uat-tscms.aptonline.in:8085/StudentServices/StudentRegistration/Sp_Student_Grievance_Details_insert', payload)
//       .then(() => {
//         setToast({ open: true, message: 'Grievance submitted successfully', severity: 'success' });
//         reset();
//         fetchGrievanceTableData();
//       })
//       .catch((err) => {
//         console.error('Submission error:', err);
//         setToast({ open: true, message: 'Submission failed', severity: 'error' });
//       })
//       .finally(() => setLoading(false));
// }
// catch(error){
// console.error("Your not Authorized Person");
// }
// };


  const fetchGrievanceById = async (grievanceId) => {
    try {
      if(selectedLevel===levelflag)
      {
 const res = await fetch(
        `${API_BASE}/sp_student_grievance_details_select_grividdetails?grivenceid=${grievanceId}`
      );
      const json = await res.json();
      if (json.code === 200 && json.result.length > 0) {
        const data = json.result[0];
        setModalData(data);
        setSelectedProcessId(""); // clear action dropdown on open
        setShowModal(true);
      }
      }
      else{
     // alert("You ar not Authorized person");
      toast.info("You ar not Authorized persons");
     //  toast.success("Grievance action submitted successfully");
      //toast.error("You are not Authorized person");
      }
     
    } catch (error) {
      console.error("Error fetching grievance detail:", error);
    }
  };

  const handleActionSubmit = async () => {
    const userid = sessionStorage.getItem("userid");
    if (!selectedProcessId || !modalData?.grievanceeID) return;

    const payload = {
      grievanceID: modalData.grievanceeID,
       Userid: userid,
      status: selectedProcessId,
      remarks: modalData.remarks || "",
    };

    try {
      const response = await fetch(
        `${API_BASE}/update_grievance_Details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.code === 200) {
      //  alert("Grievance action submitted successfully.");
        toast.success("Grievance action submitted successfully");
        setShowModal(false);
        setSelectedProcessId("");
      } else {
        toast.error("Failed to submit grievance action");
       // alert("Failed to submit grievance action.");
      }
    } catch (err) {
      console.error("Submit error:", err);
    //  alert("Something went wrong.");
       toast.error("Something went wrong.");
    }
  };

  const doughnutData = selectedLevel
    ? {
        labels: ["Pending", "Resolved"],
        datasets: [
          {
            label: `${selectedLevel} Grievances`,
            data: [
              pendingCounts[selectedLevel] || 0,
              resolvedCounts[selectedLevel] || 0,
            ],
            backgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      }
    : null;

  return (
    <Container fluid style={{ padding: 20 }}>
 

<Row className="mb-5 justify-content-center">
  {["L1", "L2", "L3"].map((level) => (
    <Col
      key={level}
      md={4}
      sm={6}
      xs={12}
      className="mb-4 d-flex justify-content-center"
      onMouseEnter={() => setHoveredCard(level)}
      onMouseLeave={() => setHoveredCard(null)}
    >
   <Card
  className={`text-center border-0 rounded-4 ${
    selectedLevel === level
      ? "shadow-lg border border-2 border-primary"
      : "shadow-sm"
  }`}
  style={{
    width: "100%",
    maxWidth: 340,
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    backgroundColor: hoveredCard === level ? "#f0f7ff" : "#ffffff",
    ...(hoveredCard === level && {
      transform: "translateY(-8px) scale(1.03)",
      boxShadow: "0 12px 30px rgba(33, 150, 243, 0.3), 0 6px 12px rgba(0,0,0,0.06)",
      zIndex: 10,
    }),
  }}
  onClick={() => onCardClick(level, "Pending")}
>
  <Card.Header
    className="fw-semibold fs-5 text-white rounded-top"
    style={{
      background: "linear-gradient(90deg, #42a5f5, #1e88e5)",
      padding: "1rem",
      letterSpacing: "0.4px",
    }}
  >
    {level} Grievances
  </Card.Header>

  <Card.Body
    className="d-flex flex-column gap-4 px-4 py-4"
    style={{
      background: "linear-gradient(to bottom, #f9fafb, #edf2f7)",
      borderBottomLeftRadius: "0.75rem",
      borderBottomRightRadius: "0.75rem",
    }}
  >
    <MuiTooltip title={`Pending grievances for ${level}`} arrow>
      <Typography
        variant="h6"
        className="d-flex align-items-center justify-content-center gap-2 mb-0"
        style={{
          color: "#1e3a8a",
          fontWeight: 600,
          fontSize: "1.1rem",
        }}
      >
        <FaExclamationCircle size={22} color="#1e3a8a" />
        <span>
          Pending:{" "}
          <span className="badge bg-warning text-dark px-2 py-1 rounded">
            {pendingCounts[level]}
          </span>
        </span>
      </Typography>
    </MuiTooltip>

    <MuiTooltip title={`Resolved grievances for ${level}`} arrow>
      <Typography
        variant="h6"
        className="d-flex align-items-center justify-content-center gap-2 mb-0"
        style={{
          color: "#2e7d32",
          fontWeight: 600,
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        onClick={(e) => {
          e.stopPropagation();
          onCardClick(level, "Resolved");
        }}
      >
        <FaCheckCircle size={20} color="#2e7d32" />
        <span>
          Resolved:{" "}
          <span className="badge bg-success px-2 py-1 rounded">
            {resolvedCounts[level]}
          </span>
        </span>
      </Typography>
    </MuiTooltip>
  </Card.Body>
</Card>

    </Col>
  ))}
</Row>



      <Row className="mb-4">
        <Col md={4}>
          {selectedLevel && doughnutData && (
            <>
              <Typography variant="h6" className="mb-3">
                {selectedLevel} Grievance Summary
              </Typography>
              <Doughnut data={doughnutData} />
            </>
          )}
        </Col>
        <Col md={8}>
          <Typography variant="h6" className="mb-3">
            {selectedLevel && selectedStatus
              ? `${selectedLevel} Grievances - ${selectedStatus}`
              : "Select a level and status to see details"}
          </Typography>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={grievanceData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              loading={loading}
              disableSelectionOnClick
            />
          </div>
        </Col>
      </Row>

      {/* Modal */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedProcessId("");
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Grievance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData ? (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Grievance ID</Form.Label>
                <Form.Control value={modalData.grievanceeID} readOnly />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Grievance Type</Form.Label>
                <Form.Control value={modalData.gritype} readOnly />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Grievance Sub Type</Form.Label>
                <Form.Control value={modalData.griinformation} readOnly />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Grievance Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={modalData.griDescription}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Status</Form.Label>
                <Form.Control value={modalData.status} readOnly />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Grievance Action</Form.Label>
                <Form.Select
                  value={selectedProcessId}
                  onChange={(e) => setSelectedProcessId(e.target.value)}
                >
                  <option value="">Select Action</option>
                  {actionOptions.map((opt) => (
                    <option
                      key={opt.procesS_STATUS_ID}
                      value={opt.procesS_STATUS_ID}
                    >
                      {opt.process_status_desc}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Grievance Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={modalData.remarks === "NA" ? "" : modalData.remarks}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Form>
          ) : (
            <div>Loading...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setSelectedProcessId("");
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            disabled={!selectedProcessId}
            onClick={handleActionSubmit}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
         <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    </Container>
  );
};

export default GrievanceProcess;
