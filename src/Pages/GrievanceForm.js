import React, { useEffect, useState, useMemo } from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { blue } from '@mui/material/colors';

const GrievanceForm = () => {
  const [grievanceTypes, setGrievanceTypes] = useState([]);
  const [grievanceSubtypes, setGrievanceSubtypes] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: {
      grievanceType: '',
      grievanceSubtype: '',
      description: '',
    },
  });

  const selectedType = watch('grievanceType');
  const userId = sessionStorage.getItem('userId');
  const role = sessionStorage.getItem('roleId');

  const [searchText, setSearchText] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch grievance types
  useEffect(() => {
    axios
      .get('https://uat-tscms.aptonline.in:8085/MasterServices/master/Master_grievancetypes_populate')
      .then((res) => {
        if (res.data.code === 200) {
          setGrievanceTypes(res.data.result);
        }
      })
      .catch((err) => console.error('Error loading types:', err));
  }, []);

  // Fetch subtypes when grievanceType changes
  useEffect(() => {
    if (selectedType) {
      axios
        .get(`https://uat-tscms.aptonline.in:8085/MasterServices/master/Master_grievanceinformation_populate?grievanceid=${selectedType}`)
        .then((res) => {
          if (res.data.code === 200) {
            setGrievanceSubtypes(res.data.result);
            resetField('grievanceSubtype');
          }
        })
        .catch((err) => console.error('Error loading subtypes:', err));
    } else {
      setGrievanceSubtypes([]);
      resetField('grievanceSubtype');
    }
  }, [selectedType, resetField]);

  const fetchGrievanceTableData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://uat-tscms.aptonline.in:8085/StudentServices/StudentRegistration/sp_student_grievance_details_select?StudentId=${userId}`);
      if (res.data.code === 200 && Array.isArray(res.data.result)) {
        const mappedData = res.data.result.map((item, index) => ({
          id: index,
          grievanceeno: item.grievanceeID || '',
          grievanceType: item.gritype || '',
          grievanceSubtype: item.griinformation || '',
          description: item.griDescription || '',
          status: item.status || '',
          dateofsubmission: item.dateofsubmission || '',
        }));
        setTableData(mappedData);
      } else {
        console.warn('Unexpected API format:', res.data);
      }
    } catch (error) {
      console.error('Failed to fetch grievance table data:', error);
      setToast({ open: true, message: 'Failed to load grievance data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievanceTableData();
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    const payload = {
      gristudentid: userId,
      gritype: data.grievanceType,
      griiinformation: data.grievanceSubtype,
      gridescription: data.description,
      createdby: userId,
      IPAddress: "123",
    };

    axios
      .post('https://uat-tscms.aptonline.in:8085/StudentServices/StudentRegistration/Sp_Student_Grievance_Details_insert', payload)
      .then(() => {
        setToast({ open: true, message: 'Grievance submitted successfully', severity: 'success' });
        reset();
        fetchGrievanceTableData();
      })
      .catch((err) => {
        console.error('Submission error:', err);
        setToast({ open: true, message: 'Submission failed', severity: 'error' });
      })
      .finally(() => setLoading(false));
  };

  const filteredData = useMemo(() => {
    return tableData.filter((row) =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [tableData, searchText]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Grievances');
    XLSX.writeFile(wb, 'grievances.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Grievance Type', 'Grievance Subtype', 'Description'];
    const tableRows = filteredData.map(row => [row.grievanceType, row.grievanceSubtype, row.description]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.text('Grievance List', 14, 15);
    doc.save('grievances.pdf');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mt-4">
 <h5
  className="text-dark text-center py-3 rounded"
  style={{ backgroundColor: '#f0f8ff' /* light pastel blue */ }}
>
  Grievance Requesting
</h5>
<br/>
      <Grid container spacing={2}>
        {/* Grievance Type */}
        <Grid item>
          <FormControl error={!!errors.grievanceType} sx={{ width: 300 }}>
            <InputLabel id="grievanceType-label">Grievance Type</InputLabel>
            <Controller
              name="grievanceType"
              control={control}
              rules={{ required: 'Grievance type is required' }}
              render={({ field }) => (
                <Select {...field} labelId="grievanceType-label" label="Grievance Type">
                  <MenuItem value=""><em>-- Please Select --</em></MenuItem>
                  {grievanceTypes.map((type) => (
                    <MenuItem key={type.grievanceID} value={type.grievanceID}>
                      {type.grievanceType}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        {/* Grievance Subtype */}
        <Grid item>
          <FormControl error={!!errors.grievanceSubtype} sx={{ width: 300 }}>
            <InputLabel id="grievanceSubtype-label">Grievance Subtype</InputLabel>
            <Controller
              name="grievanceSubtype"
              control={control}
              rules={{ required: 'Grievance subtype is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="grievanceSubtype-label"
                  label="Grievance Subtype"
                  disabled={!grievanceSubtypes.length}
                >
                  <MenuItem value=""><em>-- Please Select --</em></MenuItem>
                  {grievanceSubtypes.map((sub) => (
                    <MenuItem key={sub.gsubtypeid} value={sub.gsubtypeid}>
                      {sub.grievanceInfoName}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        {/* Description */}
        <Grid item>
          <Controller
            name="description"
            control={control}
            rules={{
              required: 'Description is required',
              minLength: { value: 10, message: 'Minimum 10 characters' },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{ width: 300 }}
              />
            )}
          />
        </Grid>

        {/* Submit */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit Grievance'}
          </Button>
        </Grid>
      </Grid>

      {/* Search + Export */}
      <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Grid item>
          <TextField
            label="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
          />
        </Grid>
        <Grid item><Button variant="outlined" onClick={exportToExcel}>Export to Excel</Button></Grid>
        <Grid item><Button variant="outlined" onClick={exportToPDF}>Export to PDF</Button></Grid>
      </Grid>

      {/* DataGrid Table */}
      <div className="row mt-4">
        <div className="col-12">
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
  rows={filteredData}
  columns={[
    { field: 'grievanceeno', headerName: 'Grievance ID', width: 150 },
    { field: 'grievanceType', headerName: 'Grievance Type', width: 180 },
    { field: 'grievanceSubtype', headerName: 'Grievance Subtype', width: 180 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'dateofsubmission', headerName: 'Date of Request', width: 160 },
    { field: 'description', headerName: 'Description', width: 300 },
  ]}
  pageSize={rowsPerPage}
  rowsPerPageOptions={[5, 10, 25]}
  onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
  pagination
  loading={loading}
  disableSelectionOnClick
  sx={{
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#d1ecf1', // Bootstrap bg-info color
      color: '#0c5460',           // Bootstrap text-info color
      fontWeight: 'bold',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      color: '#0c5460',
      fontWeight: 'bold',
    },
  }}
/>

          </div>
        </div>
      </div>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default GrievanceForm;
