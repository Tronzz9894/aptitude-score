import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Assessment from './Assessment';

function Dashboard() {
  const navigate = useNavigate();
  const [showAssessment, setShowAssessment] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    alert('Logged out successfully!');
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleFreeTrial = () => {
    alert('Enjoy Your Free Trial');
    navigate('/free-trial');
  };

  const handleStartAssessment = () => {
    setShowAssessment(true);
  };

  const handleHideAssessment = () => {
    setShowAssessment(false);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>Assessment Dashboard</h1>
        <div style={styles.buttonGroup}>
          <button style={styles.navButton} onClick={handleFreeTrial}>Free Trial</button>
          <button style={styles.navButton} onClick={handleStartAssessment}>Start Assessment</button>

          {/* Profile Tab with Dropdown */}
          <div style={styles.profileContainer}>
            <button 
              style={styles.profileButton} 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              Profile ▼
            </button>
            {showProfileDropdown && (
              <div style={styles.dropdownMenu}>
                <button style={styles.dropdownItem} onClick={handleEditProfile}>Edit Profile</button>
                <button style={styles.dropdownItem} onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.dashboardContent}>
        {!showAssessment && (
          <div style={styles.emptyAssessmentSection}>
            <h2>Welcome to your Assessment!</h2>
            <p>Start an assessment or explore a free trial.</p>
          </div>
        )}

        {showAssessment && (
          <div style={styles.assessmentSection}>
            <Assessment />
            <button style={styles.closeButton} onClick={handleHideAssessment}>
              Close Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f4f6f9',
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden',  // Disable scrolling
  },
  navbar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  navTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  navButton: {
    padding: '10px 15px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  profileContainer: {
    position: 'relative',
  },
  profileButton: {
    padding: '10px 15px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '40px',
    right: '0',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownItem: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#fff',
    color: '#333',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px',
    width: '100%',
  },
  dropdownItemHover: {
    backgroundColor: '#f1f1f1',
  },
  dashboardContent: {
    width: '90%',
    maxWidth: '800px',
    marginTop: '30px',
    textAlign: 'center',
    flex: 1, // Ensure the content stretches to fill available space
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  emptyAssessmentSection: {
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  assessmentSection: {
    marginTop: '20px',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },

  // **Responsive Styles**
  '@media (max-width: 768px)': {
    navbar: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '15px',
    },
    navTitle: {
      fontSize: '20px',
      marginBottom: '15px',
    },
    buttonGroup: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '15px',
    },
    profileContainer: {
      marginTop: '10px',
    },
    dashboardContent: {
      width: '95%',
      marginTop: '20px',
    },
    navButton: {
      padding: '12px 20px',
      fontSize: '16px',
    },
    closeButton: {
      padding: '12px 18px',
      fontSize: '16px',
    },
  },

  '@media (max-width: 480px)': {
    navbar: {
      padding: '10px',
    },
    navTitle: {
      fontSize: '18px',
      marginBottom: '10px',
    },
    buttonGroup: {
      flexDirection: 'column',
      gap: '12px',
    },
    navButton: {
      padding: '10px 15px',
      fontSize: '14px',
    },
    dashboardContent: {
      width: '90%',
    },
    emptyAssessmentSection: {
      padding: '20px',
    },
    assessmentSection: {
      padding: '20px',
    },
    closeButton: {
      padding: '10px 15px',
      fontSize: '14px',
    },
  },
};

export default Dashboard;
