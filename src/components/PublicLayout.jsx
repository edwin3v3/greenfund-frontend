import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';

function PublicLayout() {
  return (
    <div className="bg-background">
      <PublicNavbar />
      <main>
        <Outlet /> {/* Public pages like Landing, Login, Register will render here */}
      </main>
    </div>
  );
}

export default PublicLayout;