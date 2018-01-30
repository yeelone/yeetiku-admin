import React from 'react';

function MainLayout({ children, location }) {
  return (
    <div>
    <h1> hello ,this is main layout </h1>
      <div >
        <div >
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout