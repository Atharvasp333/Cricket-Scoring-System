import React from 'react';
import { Navigate } from 'react-router-dom';
import { Dashboard, Profile, CaptainApproval } from '../Screens/Player';
import ProtectedRoute from '../Components/ProtectedRoute';

const playerRoutes = [
  {
    path: '/player/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['player']}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/profile',
    element: (
      <ProtectedRoute allowedRoles={['player']}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/captain-approval',
    element: (
      <ProtectedRoute allowedRoles={['player']}>
        <CaptainApproval />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/*',
    element: <Navigate to="/player/dashboard" replace />,
  },
];

export default playerRoutes;
