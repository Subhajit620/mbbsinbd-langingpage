import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Configure axios defaults to send credentials/cookies
  axios.defaults.withCredentials = true;

  const fetchDashboardData = async () => {
    try {
      // Session check & fetch leads
      const leadsRes = await axios.get('/api/leads');
      setLeads(leadsRes.data.data.leads);
      setStats(leadsRes.data.data.stats);
    } catch (err) {
      console.error(err);
      // Unauthorized, redirect to login
      navigate('/admin-login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteLead = async (lead) => {
    if (!window.confirm(`Delete the enquiry from "${lead.name}"? This cannot be undone.`)) return;
    setActioningId(lead._id);
    try {
      await axios.delete(`/api/leads/${lead._id}`);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete lead.');
    } finally {
      setActioningId(null);
    }
  };

  const handleResendEmail = async (lead) => {
    setActioningId(lead._id);
    try {
      const res = await axios.post(`/api/leads/${lead._id}/resend-email`);
      alert(res.data.message || 'Email resent successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resend email.');
    } finally {
      setActioningId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('adminToken');
      navigate('/admin-login');
    }
  };

  // Filter leads based on search query
  const filteredLeads = leads.filter(lead => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (lead.name && lead.name.toLowerCase().includes(q)) ||
      (lead.email && lead.email.toLowerCase().includes(q)) ||
      (lead.phone && lead.phone.toLowerCase().includes(q)) ||
      (lead.location && lead.location.toLowerCase().includes(q)) ||
      (lead.report_id && lead.report_id.toLowerCase().includes(q)) ||
      (lead.query && lead.query.toLowerCase().includes(q))
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const displayedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f1f5f9' }}>
        <h3>Loading dashboard details...</h3>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f1f5f9', fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', margin: 0 }}>
      {/* Styles */}
      <style>{`
        * { box-sizing: border-box; }
        .sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          top: 0; left: 0;
          padding: 25px;
          background: linear-gradient(135deg, #111827, #2563eb);
          color: white;
          z-index: 100;
        }
        .sidebar h2 { font-size: 24px; margin-bottom: 40px; }
        .sidebar a {
          display: flex; gap: 12px; align-items: center;
          padding: 14px; margin-bottom: 12px; border-radius: 12px;
          color: white; text-decoration: none; transition: .3s;
        }
        .sidebar a:hover {
          background: white; color: #2563eb; transform: translateX(8px);
        }
        .main { margin-left: 260px; padding: 30px; width: calc(100% - 260px); }
        .topbar {
          background: white; padding: 20px; border-radius: 20px;
          display: flex; justify-content: space-between; align-items: center;
          box-shadow: 0 10px 30px rgba(0,0,0,.08);
        }
        .welcome {
          margin-top: 25px; padding: 35px; border-radius: 25px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white; margin-bottom: 25px;
        }
        .welcome h1 { font-weight: 700; margin-bottom: 8px; }
        .stats-row { display: flex; gap: 20px; margin-bottom: 30px; }
        .card-box {
          flex: 1; background: white; padding: 25px; border-radius: 22px;
          box-shadow: 0 10px 30px rgba(0,0,0,.08); transition: .3s;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .card-box:hover { transform: translateY(-8px); }
        .icon {
          height: 60px; width: 60px; border-radius: 50%;
          color: white; display: flex; align-items: center;
          justify-content: center; font-size: 25px;
        }
        .table-card { background: white; padding: 25px; border-radius: 25px; box-shadow: 0 10px 30px rgba(0,0,0,.08); }
        .table-responsive { overflow-x: auto; margin-top: 20px; }
        .search-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .search-container input {
          border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 16px;
          outline: none; font-size: 14px; transition: border-color 0.2s;
          width: 250px; background: #f8fafc;
        }
        .search-container input:focus { border-color: #3b82f6; background: #ffffff; }
        #userTable { border-collapse: collapse; width: 100%; margin: 15px 0; border: none; }
        #userTable th {
          background-color: #0f172a; color: #ffffff; font-weight: 600;
          padding: 14px 16px; text-align: left; font-size: 14px;
        }
        #userTable td {
          padding: 12px 16px; border-bottom: 1px solid #f1f5f9;
          font-size: 13.5px; color: #334155; vertical-align: middle;
        }
        #userTable tr:hover { background-color: #f8fafc; }
        .query-cell { max-width: 300px; white-space: normal; word-break: break-word; }
        .pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
        .pagination-buttons { display: flex; gap: 8px; }
        .pagination-btn {
          border-radius: 6px; border: 1px solid #cbd5e1; padding: 6px 12px;
          transition: all 0.2s; font-size: 13px; cursor: pointer; background: white; color: #0f172a;
        }
        .pagination-btn:hover { background: #e2e8f0; border-color: #cbd5e1; }
        .pagination-btn.active { background: #2563eb; color: white; border: 1px solid #2563eb; }
        .pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 992px) {
          .sidebar { display: none; }
          .main { margin-left: 0; padding: 15px; width: 100%; }
          .stats-row { flex-direction: column; }
        }
      `}</style>

      {/* HTML Header Links and CDNs mapped into our page imports */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>
          <i className="fa-solid fa-graduation-cap" style={{ marginRight: '10px' }}></i>
          MBBS Admin
        </h2>
        <a href="#leads">
          <i className="fa fa-users"></i>
          Students
        </a>
        <a href="#" onClick={handleLogout}>
          <i className="fa fa-power-off"></i>
          Logout
        </a>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <h3>Dashboard</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>
              <i className="fa fa-user-circle" style={{ marginRight: '5px' }}></i>
              Admin
            </span>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">
              Logout
            </button>
          </div>
        </div>

        {/* WELCOME */}
        <div className="welcome">
          <h1>Welcome Back Admin 👋</h1>
          <p>Manage all MBBS admission enquiries from here.</p>
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="card-box">
            <div>
              <div className="icon" style={{ background: '#2563eb' }}>
                <i className="fa fa-users"></i>
              </div>
              <h5 className="mt-3">Total Leads</h5>
              <h1 className="display-6 fw-bold text-dark mt-2">{stats?.total ?? leads.length}</h1>
            </div>
          </div>

          <div className="card-box">
            <div>
              <div className="icon" style={{ background: '#10b981' }}>
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h5 className="mt-3">Eligible Students</h5>
              <h1 className="display-6 fw-bold text-dark mt-2">{stats?.eligible ?? 0}</h1>
            </div>
          </div>

          <div className="card-box">
            <div>
              <div className="icon" style={{ background: '#f59e0b' }}>
                <i className="fa-solid fa-percent"></i>
              </div>
              <h5 className="mt-3">Conversion Rate</h5>
              <h1 className="display-6 fw-bold text-dark mt-2">{stats?.conversionRate ?? 0}%</h1>
            </div>
          </div>

          <div className="card-box">
            <div>
              <div className="icon" style={{ background: '#7c3aed' }}>
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h5 className="mt-3">Avg. NEET Score</h5>
              <h1 className="display-6 fw-bold text-dark mt-2">{stats?.avgNeet ?? 0}</h1>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="table-card" id="leads">
          <h4>Student Enquiries</h4>
          
          <div className="search-container">
            <div className="dataTables_length">
              <label>
                Show 10 entries
              </label>
            </div>
            <div className="dataTables_filter">
              <label>
                Search:
                <input
                  type="search"
                  placeholder="Type to filter..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="table-responsive">
            <table id="userTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Pass Year</th>
                  <th>NEET Score</th>
                  <th>Location</th>
                  <th>GPA (10 / 12 / Total)</th>
                  <th>Eligibility</th>
                  <th>Query</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedLeads.length > 0 ? (
                  displayedLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td style={{ fontWeight: '600' }}>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.passing_year}</td>
                      <td>
                        <span className="badge bg-primary px-2.5 py-1.5">{lead.neet_score}</span>
                      </td>
                      <td>{lead.location || 'N/A'}</td>
                      <td>
                        {Number(lead.calculated_gpa_10).toFixed(2)} / {Number(lead.calculated_gpa_12).toFixed(2)} / {(Number(lead.calculated_gpa_10) + Number(lead.calculated_gpa_12)).toFixed(2)}
                      </td>
                      <td>
                        <span className={`badge ${lead.is_eligible ? 'bg-success' : 'bg-danger'}`}>
                          {lead.is_eligible ? 'Eligible' : 'Not Eligible'}
                        </span>
                      </td>
                      <td className="query-cell">{lead.query || 'N/A'}</td>
                      <td>{formatDate(lead.submitted_at)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {lead.pdf_url && (
                            <a
                              href={`${axios.defaults.baseURL || ''}${lead.pdf_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary"
                              title="View PDF Report"
                            >
                              <i className="fa-solid fa-file-pdf"></i>
                            </a>
                          )}
                          <button
                            className="btn btn-sm btn-outline-success"
                            disabled={actioningId === lead._id}
                            onClick={() => handleResendEmail(lead)}
                            title="Resend Report Email"
                          >
                            <i className="fa-solid fa-envelope"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            disabled={actioningId === lead._id}
                            onClick={() => handleDeleteLead(lead)}
                            title="Delete Lead"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>
                      No submissions found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <div>
                Showing {Math.min(filteredLeads.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredLeads.length, currentPage * itemsPerPage)} of {filteredLeads.length} entries
              </div>
              <div className="pagination-buttons">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
