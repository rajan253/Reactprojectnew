// LoginPage.js
import React from 'react';
import { useForm } from 'react-hook-form';

const LoginPage = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    onLogin(data.email, data.password);
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center vh-100"
      style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          <div className="d-flex justify-content-end mb-3">
            <a href="#" className="small text-decoration-none">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
        </form>

        <div className="text-center text-muted mb-2">or login with</div>

        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-outline-danger w-100">
            <i className="bi bi-google me-2"></i>Google
          </button>
          <button className="btn btn-outline-primary w-100">
            <i className="bi bi-facebook me-2"></i>Facebook
          </button>
        </div>

        <div className="text-center">
          <span className="text-muted">Don't have an account?</span>{' '}
          <a href="#" className="text-decoration-none">Register</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
