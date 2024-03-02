import React from 'react';
import { Link, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className='m-auto container-fluid d-flex flex-column justify-content-center align-items-center text-center' id="error-page">
      <h1 className='display-1'>404</h1>
      <p>The page you requested does not found</p>
      <p>
        <i>{'HTTP 404:' + ' Requested page does not found'}</i>
      </p>
      <Link to={'/'} className='text-decoration-none text-black'><h5>Return to Home</h5></Link>
    </div>
  );
}