import React from 'react';

const MaintenanceMode = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    padding: '20px'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔧</div>
    <h2>System Update in Progress</h2>
    <p>We're deploying new features. Back in 30 seconds!</p>
    <div style={{ 
      width: '200px', 
      height: '4px', 
      backgroundColor: '#e0e0e0', 
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '20px'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#4CAF50',
        animation: 'progress 30s linear'
      }}></div>
    </div>
    <style>{`
      @keyframes progress {
        from { width: 0% }
        to { width: 100% }
      }
    `}</style>
  </div>
);

export default MaintenanceMode;