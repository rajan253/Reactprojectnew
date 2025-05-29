import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

// Validation schema using Yup
const schema = Yup.object().shape({
  fullName: Yup.string().matches(/^[A-Za-z ]+$/, 'Name must contain only alphabets').required('Full Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
  dob: Yup.date().required('Date of Birth is required').nullable(),
  address: Yup.string().required('Address is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const StudentRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showSuccess, setShowSuccess] = useState(false); // State for success popup visibility

  const onSubmit = async (data) => {
    try {
      const apiUrl = 'https://uat-tscms.aptonline.in:8085/StudentServices/StudentRegistration/InsertStudentDetails_react';

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log("Response:", result);

      // Assuming response has a success indicator
      if (result?.status === 'success' || response.ok) {
        setShowSuccess(true); // Show success popup
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering student:', error);
      alert('There was an error registering the student.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Student Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="row mb-3">
          {/* Full Name */}
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
              {...register('fullName', { required: 'Full Name is required' })}
              placeholder="Enter Full Name"
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', { required: 'Email is required' })}
              placeholder="Enter Email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>
        </div>

        <div className="row mb-3">
          {/* Phone Number */}
          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              {...register('phone', { required: 'Phone number is required' })}
              placeholder="Enter Phone Number"
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
          </div>

          {/* Date of Birth */}
          <div className="col-md-6">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
              {...register('dob', { required: 'Date of Birth is required' })}
            />
            {errors.dob && <div className="invalid-feedback">{errors.dob.message}</div>}
          </div>
        </div>

        <div className="row mb-3">
          {/* Address */}
          <div className="col-md-6">
            <label className="form-label">Address</label>
            <textarea
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              {...register('address', { required: 'Address is required' })}
              placeholder="Enter Address"
            ></textarea>
            {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
          </div>

          {/* Password */}
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter Password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Register</button>
      </form>

      {/* Success Popup */}
      {showSuccess && (
        <div className="modal show fade" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
              </div>
              <div className="modal-body">
                <p>Student registered successfully!</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={() => setShowSuccess(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRegistrationForm;
