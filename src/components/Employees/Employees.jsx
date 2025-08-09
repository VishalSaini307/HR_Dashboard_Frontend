import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import "./Employees.css";
import BellIcon from "../../assets/NavbarIcons/Frame1.png";
import MailIcon from "../../assets/NavbarIcons/Frame2.png";
import ProfileIcon from "../../assets/NavbarIcons/Frame3.png";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMenu, setActionMenu] = useState({ visible: false, index: null });
  const [editData, setEditData] = useState(null); // Store employee being edited
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileDropdownRef = React.useRef(null);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");

  // Fetch data from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://hr-dashboard-backend-in6k.vercel.app/api/candidates/getall", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        const selectedEmployees = Array.isArray(data)
          ? data.filter((emp) => emp.status === "Selected")
          : (data.candidates || []).filter((emp) => emp.status === "Selected");

        setEmployees(selectedEmployees);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Close menu when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".actionMenu") &&
        !event.target.closest(".employeesActionBtn")
      ) {
        setActionMenu({ visible: false, index: null });
      }
    };

    const handleScroll = () => {
      setActionMenu({ visible: false, index: null });
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleActionClick = (idx) => {
    setActionMenu((prev) =>
      prev.visible && prev.index === idx
        ? { visible: false, index: null }
        : { visible: true, index: idx }
    );
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://hr-dashboard-backend-in6k.vercel.app/api/candidates/delete/${id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee.");
    }
  };

  // Open edit form
  const handleEdit = (emp) => {
    setEditData(emp);
    setShowEditForm(true);
    setActionMenu({ visible: false, index: null });
  };

  // Handle edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://hr-dashboard-backend-in6k.vercel.app/api/candidates/update/${editData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(editData),
        }
      );
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updated = await res.json();
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === updated._id ? updated : emp))
      );
      setShowEditForm(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update employee.");
    }
  };
  // Filter + Search logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition =
      positionFilter === "" || emp.position === positionFilter;

    return matchesSearch && matchesPosition;
  });
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="employeesPage">
      <Navbar />
      <div className="employeesContent">
        <div className="employeesHeader">
          <div className="employeesHeaderTop">
            <h2>Employees</h2>

            <div className="candidateIconFrame">
              <span>
                <img
                  src={BellIcon}
                  alt="Notifications"
                  className="candidateIcon"
                />
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
            <select
              className="employeesDropdown"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="">Position</option>
              <option value="Designer">Designer</option>
              <option value="Developer">Developer</option>
              <option value="Human Resource">Human Resource</option>
            </select>
            <input
              type="text"
              className="employeesSearch"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="employeesTableWrapper">
          {loading ? (
            <p>Loading...</p>
          ) : employees.length === 0 ? (
            <p>No employees found</p>
          ) : (
            <table className="employeesTable">
              <thead>
                <tr className="employeesTableHeadRow">
                  <th>Employee Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Position</th>

                  <th>Date of Joining</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, idx) => (
                  <tr key={emp._id || idx}>
                    <td>{emp.fullName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phoneNumber}</td>
                    <td>{emp.position}</td>
                    <td>
                      {emp.dateJoining
                        ? new Date(emp.dateJoining).toLocaleDateString()
                        : "-"}
                    </td>
                    <td style={{ position: "relative" }}>
                      <button
                        className="employeesActionBtn"
                        onClick={() => handleActionClick(idx)}
                      >
                        &#8942;
                      </button>

                      {actionMenu.visible && actionMenu.index === idx && (
                        <div className="actionMenu">
                          <div
                            className="actionMenuItem"
                            onClick={() => handleEdit(emp)}
                          >
                            Edit
                          </div>
                          <div
                            className="actionMenuItem"
                            onClick={() => handleDelete(emp._id)}
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Form Modal */}
        {showEditForm && (
          <div className="employeeModalOverlay">
            <div className="editModalContent">
              <div className="employeeModalHeader">
                Edit Employee Details
                <span
                  className="employeeModalClose"
                  onClick={() => setShowEditForm(false)}
                >
                  &times;
                </span>
              </div>
              <form onSubmit={handleEditSubmit} className="employeeModalForm">
                <div className="employeeModalBody">
                  <div className="employeeModalRow">
                    <div className="employeeModalCol">
                      <input
                        type="text"
                        value={editData.fullName}
                        onChange={(e) =>
                          setEditData({ ...editData, fullName: e.target.value })
                        }
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    <div className="employeeModalCol">
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        placeholder="Email"
                        required
                      />
                    </div>
                  </div>
                  <div className="employeeModalRow">
                    <div className="employeeModalCol">
                      <input
                        type="text"
                        value={editData.phoneNumber}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                    <div className="employeeModalCol">
                      <input
                        type="text"
                        value={editData.position}
                        onChange={(e) =>
                          setEditData({ ...editData, position: e.target.value })
                        }
                        placeholder="Position"
                        required
                      />
                    </div>
                  </div>
                  <div className="employeeModalRow">
               
                    <div className="employeeModalCol">
                      <input
                        type="text"
                        value={editData.dateJoining || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            dateJoining: e.target.value,
                          })
                        }
                        placeholder="Date of Joining"
                      />
                    </div>
                  </div>
                  <button type="submit" className="candidateModalSaveBtn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
