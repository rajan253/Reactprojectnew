import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch roles based on User ID
  const fetchRolesByUserId = async () => {
    const userId = getValues('userId');
    if (!userId) return;

    setLoadingRoles(true);
    try {
      const response = await axios.get(
        `https://uat-tscms.aptonline.in:8085/coreservices/account/getuser_roles?Userid=${userId}`
      );

      if (response.data.code === 200) {
        setRoles(response.data.result || []);
      } else {
        setRoles([]);
        alert('No roles found for this user.');
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      setRoles([]);
    }
    setLoadingRoles(false);
  };

  // Handle login
  const onSubmit = async (data) => {
    const { userId, password, role } = data;

    try {
      const response = await axios.get(
        `https://uat-tscms.aptonline.in:8085/coreservices/account/login`,
        {
          params: {
            Userid: userId,
            password: password,
            Userrole: role,
          },
        }
      );

      if (response.data.code === 200 && response.data.result?.authToken) {
        const loginResult = response.data.result;

        // Store data in session storage
        sessionStorage.setItem('userId', loginResult.userId);
        sessionStorage.setItem('roleId', loginResult.timetableroleid);
        sessionStorage.setItem('authToken', loginResult.authToken);
        sessionStorage.setItem('name', loginResult.name);
        sessionStorage.setItem('email', loginResult.eMail);
        sessionStorage.setItem('mobile', loginResult.mobile);

        onLogin(loginResult); // Notify parent
        navigate('/MainLayout'); // Redirect
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error. Please try again.');
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center vh-100"
      style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* User ID */}
          <div className="mb-3">
            <label htmlFor="userId" className="form-label">User ID</label>
            <input
              type="text"
              id="userId" placeholder='Enter Username'
              className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
              {...register('userId', { required: 'User ID is required' })}
              onBlur={fetchRolesByUserId}
            />
            {errors.userId && <div className="invalid-feedback">{errors.userId.message}</div>}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password" placeholder='Please Enter Password'
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          {/* Role Dropdown */}
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Select Role</label>
            <select
              id="role"
              className={`form-select ${errors.role ? 'is-invalid' : ''}`}
              {...register('role', { required: 'Role is required' })}
            >
              <option value="">-- Select Role --</option>
              {roles.map((role, index) => (
                <option key={index} value={role.userRoleId}>
                  {role.userRoleName}
                </option>
              ))}
            </select>
            {loadingRoles && <div className="form-text">Loading roles...</div>}
            {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
        </form>

        <div className="text-center">
          <span className="text-muted">Don't have an account?</span>{' '}
          <a href="#" className="text-decoration-none">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
