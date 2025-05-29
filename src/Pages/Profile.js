// src/Pages/Profile.js
import React from 'react';
import './Profile.css';

export default function Profile() {
  const name = sessionStorage.getItem('name') || 'Rajender Moturi';
  const email = sessionStorage.getItem('email') || 'test2gmail.com';
  const userId = sessionStorage.getItem('userId') || '301880';
  const mobile = sessionStorage.getItem('mobile') || '99999999';
  const roleId = sessionStorage.getItem('roleId') || 'Test';

  return (
    <div
      className="modal fade"
      id="profileModal"
      tabIndex="-1"
      aria-labelledby="profileModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content shadow-lg rounded-3">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center" id="profileModalLabel">
              <i className="bi bi-person-circle me-2 fs-3"></i> User Profile
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="container py-4">
              <div className="row align-items-center mb-4">
                <div className="col-md-2 text-center">
                  <i className="bi bi-person-circle display-1 text-primary"></i>
                </div>
                <div className="col-md-10">
                  <h3 className="fw-semibold mb-1">{name}</h3>
                  <p className="text-muted mb-1"><i className="bi bi-person-badge me-2"></i>User ID: <strong>{userId}</strong></p>
                  <p className="text-muted"><i className="bi bi-shield-lock me-2"></i>Role ID: <strong>{roleId}</strong></p>
                </div>
              </div>

              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item bg-transparent d-flex align-items-center">
                      <i className="bi bi-envelope-fill text-primary me-3 fs-5"></i>
                      <span><strong>Email:</strong> {email}</span>
                    </li>
                    <li className="list-group-item bg-transparent d-flex align-items-center">
                      <i className="bi bi-telephone-fill text-primary me-3 fs-5"></i>
                      <span><strong>Mobile:</strong> {mobile}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light">
            <button className="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i className="bi bi-x-circle me-1"></i> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
