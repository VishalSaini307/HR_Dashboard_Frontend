import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Navbar } from "../Navbar/Navbar";
import "./Leaves.css";
import BellIcon from "../../assets/NavbarIcons/Frame1.png";
import MailIcon from "../../assets/NavbarIcons/Frame2.png";
import ProfileIcon from "../../assets/NavbarIcons/Frame3.png";
import axios from "axios";
const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Get all approved leaves
  const approvedLeaves = leaves.filter(l => l.attendanceStatus === "Approved");
  // Dates with approved leaves (as Date objects)
  const approvedDates = approvedLeaves.map(l => new Date(l.leaveDate));
  // Show all approved leaves (not filtered by date)
  const approvedForSelectedDate = approvedLeaves;
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileDropdownRef = React.useRef(null);
  const actionMenuRef = React.useRef(null);
  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (isDropdownOpen) {
      const handleClickOutside = (event) => {
        if (
          profileDropdownRef.current &&
          !profileDropdownRef.current.contains(event.target)
        ) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isDropdownOpen]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    employeeName: "",
    designation: "",
    leaveDate: "",
    documents: null,
    reason: "",
  });
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleStatusChange = async (id, newStatus) => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave._id === id ? { ...leave, attendanceStatus: newStatus } : leave
      )
    );
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://hr-dashboard-backend-gamma.vercel.app/api/employee-leaves/${id}`,
        { attendanceStatus: newStatus },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };


  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://hr-dashboard-backend-gamma.vercel.app/api/employee-leaves",
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setLeaves(Array.isArray(res.data) ? res.data : []);
    } catch {
      setLeaves([]);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("employeeName", form.employeeName);
    formData.append("designation", form.designation);
    formData.append("leaveDate", form.leaveDate);
    if (form.documents) {
      formData.append("documents", form.documents);
    }
    formData.append("reason", form.reason);
    formData.append("attendanceStatus", "Pending"); // Always set to 'Pending' on creation
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        'http://hr-dashboard-backend-gamma.vercel.app/api/employee-leaves',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      await fetchLeaves();
      setShowModal(false);
      setForm({
        employeeName: "",
        designation: "",
        leaveDate: "",
        documents: null,
        reason: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to submit leave request. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://hr-dashboard-backend-gamma.vercel.app/api/employee-leaves/${id}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      await fetchLeaves();
    } catch (error) {
      alert("Failed to delete leave record.");
    }
  };


  return (
    <div className="employeesPage">
      <Navbar />
      <div className="employeesContent">
        {/* Header */}
        <div className="employeesHeader">
          <div className="employeesHeaderTop">
            <h2>Leaves</h2>
            <div className="candidateIconFrame">
              <span>
                <img src={BellIcon} alt="Notifications" className="candidateIcon" />
                <span className="candidateIconBadge"></span>
              </span>
              <span>
                <img src={MailIcon} alt="Mail" className="candidateIcon" />
                <span className="candidateIconBadge"></span>
              </span>
              <div className="profileDropdownWrapper" ref={profileDropdownRef}>
                <div className="candidateIconWrapper">
                  <img
                    src={ProfileIcon}
                    alt="Profile"
                    className="candidateIcon"
                    onClick={toggleDropdown}
                  />
                  <span className="candidateIconBadge"></span>
                </div>
                {isDropdownOpen && (
                  <div className="dropdownMenu">
                    <div className="dropdownItem">Edit Profile</div>
                    <div className="dropdownItem">Change Password</div>
                    <div className="dropdownItem">Manage Notification</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="employeesHeaderBottom">
            <div className="leaveStatusFilterWrapper">
              <select
                className={`leaveStatusSelect${statusFilter ? ' leaveStatus' + statusFilter : ''}`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Attendance Status</option>
                <option value="Pending" className="leaveStatusPending">Pending</option>
                <option value="Approved" className="leaveStatusApproved">Approved</option>
                <option value="Rejected" className="leaveStatusRejected">Rejected</option>
              </select>
            </div>
            <div>

              <input
                type="text"
                className="employeesSearch"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="candidateAddBtn"
                onClick={() => setShowModal(true)}
              >
                Add Candidate
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="leavesMain">
          {/* Applied Leaves Section */}
          <div className="appliedLeavesCard">
            <div className="appliedLeavesHeader">Applied Leaves</div>
            <table className="appliedLeavesTable">
              <thead>
                <tr>

                  <th>Name</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Docs</th>
                </tr>
              </thead>
              <tbody>
                {leaves
                  .filter(leave => {
                    let statusMatch = true;
                    if (statusFilter) {
                      statusMatch = leave.attendanceStatus === statusFilter;
                    }
                    const search = searchTerm.trim().toLowerCase();
                    const searchMatch =
                      !search ||
                      leave.employeeName?.toLowerCase().includes(search) ||
                      leave.designation?.toLowerCase().includes(search) ||
                      leave.reason?.toLowerCase().includes(search);
                    return statusMatch && searchMatch;
                  })
                  .map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      <div className="leaveName">{leave.employeeName}</div>
                      <div className="leaveRole">{leave.designation}</div>
                    </td>
                    <td>{leave.leaveDate ? new Date(leave.leaveDate).toLocaleDateString() : ''}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <select
                        className={`leaveStatusSelect leaveStatus${leave.attendanceStatus}`}
                        value={leave.attendanceStatus}
                        onChange={e => handleStatusChange(leave._id, e.target.value)}
                      >
                        <option value="Pending" className="leaveStatusPending">Pending</option>
                        <option value="Approved" className="leaveStatusApproved">Approved</option>
                        <option value="Rejected" className="leaveStatusRejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      {leave.documents ? (
                        <>
                          <a
                            href={`http://hr-dashboard-backend-gamma.vercel.app/api/employee-leaves/${leave._id}/download-document`}
                            className="docBtn"
                            title="Download Document"
                            download
                          >
                            📄
                          </a>
                        </>
                      ) : (
                        <span className="docBtn">-</span>
                      )}
                      <button className="docBtn" style={{marginLeft: 8}} onClick={() => handleDelete(leave._id)} title="Delete">�️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Leave Calendar Section */}
          <div className="leaveCalendarCard">
            <div className="leaveCalendarHeader">Leave Calendar</div>
            <div className="calendarBox">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date, view }) => {
                  if (view === 'month' && approvedDates.some(d => d.toDateString() === date.toDateString())) {
                    return 'approved-leave-date';
                  }
                  return null;
                }}
              />
            </div>
            <div className="approvedLeaves">
              <h4>Approved Leaves</h4>
              {approvedForSelectedDate.length === 0 && (
                <div style={{ color: '#888', fontSize: '0.95rem' }}>No approved leaves.</div>
              )}
              {approvedForSelectedDate.map((leave) => (
                <div key={leave._id} className="approvedLeaveItem">
                  <img
                    src={leave.profilePic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(leave.employeeName)}
                    alt={leave.employeeName}
                    className="leaveProfilePicSmall"
                  />
                  <div style={{ flex: 1, marginLeft: 8 }}>
                    <div className="leaveName">{leave.employeeName}</div>
                    <div className="leaveRole">{leave.designation}</div>
                  </div>
                  <div className="leaveDate">{leave.leaveDate ? new Date(leave.leaveDate).toLocaleDateString() : ''}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
        {showModal && (
          <div className="leaveModalOverlay">
            <form className="leaveModalForm" onSubmit={handleSubmit}>
              <div className="leaveModalHeader">
                Add New Leave
                <span
                  className="leaveModalClose"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </span>
              </div>

              <div className="leaveModalBody">
                <div className="leaveModalRow">
                  {/* Employee Name */}
                  <div className="leaveModalCol">
                    <input
                      type="text"
                      name="employeeName"
                      required
                      value={form.employeeName}
                      onChange={handleInputChange}
                      placeholder="Employee Name *"
                      className="leaveModalInput"
                    />
                  </div>



                  {/* Designation */}
                  <div className="leaveModalCol">
                    <input
                      name="designation"
                      type="text"
                      required
                      value={form.designation}
                      onChange={handleInputChange}
                      placeholder="Designation *"
                      className="leaveModalInput"
                    />
                  </div>
                </div>

                <div className="leaveModalRow">
                  {/* Leave Date */}
                  <div className="leaveModalCol">
                    <input
                      name="leaveDate"
                      type="date"
                      required
                      value={form.leaveDate}
                      onChange={handleInputChange}
                      className="leaveModalInput"
                    />
                  </div>

                  {/* Documents Upload */}
                  <div className="leaveModalCol">
                    <div className="leaveModalFileWrap">
                      <input
                        name="documents"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={handleInputChange}
                        className="leaveModalInput"
                      />
                      <span className="leaveModalFileIcon">&#8682;</span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="leaveModalRow">
                  <div className="leaveModalCol" style={{ flex: 1 }}>
                    <textarea
                      name="reason"
                      required
                      value={form.reason}
                      onChange={handleInputChange}
                      placeholder="Reason *"
                      className="leaveModalInput"
                      rows="3"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="leaveModalSaveBtn"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Leaves;
