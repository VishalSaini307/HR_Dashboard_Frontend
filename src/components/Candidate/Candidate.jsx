import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import axios from "axios";
import "./Candidate.css";
import BellIcon from "../../assets/NavbarIcons/Frame1.png";
import MailIcon from "../../assets/NavbarIcons/Frame2.png";
import ProfileIcon from "../../assets/NavbarIcons/frame3.png";

const Candidate = () => {
  const [showModal, setShowModal] = useState(false);
  const [actionmenu, setActionMenu] = useState(false);
  const actionMenuRef = React.useRef(null);
  // Close action menu when clicking outside
  useEffect(() => {
    if (actionmenu && actionmenu.visible) {
      const handleClickOutside = (event) => {
        if (
          actionMenuRef.current &&
          !actionMenuRef.current.contains(event.target)
        ) {
          handleCloseMenu();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [actionmenu]);
  const [candidates, setCandidates] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
  documents: null,
    declaration: false,
  });

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/api/candidates/getall",
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setCandidates(
        Array.isArray(res.data) ? res.data : res.data.candidates || []
      );
    } catch {
      setCandidates([]);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleActionClick = (e, idx) => {
    const rect = e.target.getBoundingClientRect();
    setActionMenu({
      visible: true,
      index: idx,
      x: rect.right + window.scrollX,
      y: rect.bottom + window.scrollY,
    });
  };

  const handleCloseMenu = () =>
    setActionMenu({ visible: false, index: null, x: 0, y: 0 });

  const handleDownloadResume = async (candidateId) => {
    handleCloseMenu();
    const token = localStorage.getItem("token");
    const downloadUrl = `http://localhost:3000/api/candidates/${candidateId}/download-resume`;
    try {
      const response = await fetch(downloadUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) {
        alert("Document not found or cannot be downloaded.");
        return;
      }
      const blob = await response.blob();
      if (blob.size === 0) {
        alert("Document is empty or missing.");
        return;
      }
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = "resume.pdf";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) filename = match[1];
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download resume. Please try again later.");
    }
  };

  const handleDeleteCandidate = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this candidate?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/candidates/delete/${id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete candidate");
      }

      alert("Candidate deleted successfully");
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting candidate");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", form.name);
    formData.append("email", form.email);
    formData.append("phoneNumber", form.phone);
    formData.append("position", form.position);
    formData.append("experience", form.experience);
    formData.append("documents", form.documents);
    formData.append("declaration", form.declaration);
    formData.append("status", "New");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/candidates/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      await fetchCandidates();
      setShowModal(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        documents: null,
        declaration: false,
      });
    } catch {
      alert("Failed to submit candidate. Please try again.");
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate, idx) => {
    const statusMatch =
      statusFilter === "" || candidate.status === statusFilter;
    const positionMatch =
      positionFilter === "" || candidate.position === positionFilter;

    const srNo = `0${idx + 1}`;
    const searchFields = [
      srNo,
      candidate.fullName,
      candidate.email,
      candidate.phoneNumber,
    ];
    const searchMatch = searchFields.some(
      (field) =>
        field &&
        field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return statusMatch && positionMatch && (searchTerm === "" || searchMatch);
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Update candidate status
  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/candidates/update/${candidateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await fetchCandidates();
    } catch (err) {
      console.error("Error updating candidate status:", err);
    }
  };

  return (
    <div className="candidatePage">
      <Navbar />
      <div className="candidateMaterial">
        <div className="candidateHeader">
          <div>
            <h2 className="candidateTitle">Candidates</h2>

            <div className="candidateFilters">
              <select
                className="candidateSelect"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value === "Status" ? "" : e.target.value
                  )
                }
              >
                <option>Status</option>
                <option>New</option>
                <option>Schduled</option>
                <option>Ongoing</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>
              <select
                className="candidateSelect"
                value={positionFilter}
                onChange={(e) =>
                  setPositionFilter(
                    e.target.value === "Position" ? "" : e.target.value
                  )
                }
              >
                <option>Position</option>
                <option>Designer</option>
                <option>Developer</option>
                <option>Human Resource</option>
              </select>
            </div>
          </div>
          <div className="candidateActions">
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
            <div className="candidateSearchAdd">
              <input
                type="text"
                placeholder="Search"
                className="candidateSearch"
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
        <div className="candidateTableWrapper">
          <table className="candidateTable">
            <thead>
              <tr className="candidateTableHeadRow">
                <th>Sr no.</th>
                <th>Candidates Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Position</th>
                <th>Status</th>
                <th>Experience</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(filteredCandidates)
                ? filteredCandidates
                : []
              ).map((candidate, idx) => (
                <tr key={candidate._id || idx}>
                  <td>{`0${idx + 1}`}</td>
                  <td>{candidate.fullName}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phoneNumber}</td>
                  <td>{candidate.position}</td>
                  <td>
                    {candidate.status === "Selected" ? (
                      <button className="candidateStatusBtn candidateStatusSelected">
                        Selected
                      </button>
                    ) : (
                      <select
                        value={candidate.status}
                        onChange={(e) =>
                          handleStatusChange(candidate._id, e.target.value)
                        }
                        className={`candidateStatusSelect candidateStatus${candidate.status}`}
                      >
                        <option>New</option>
                        <option>Schduled</option>
                        <option>Ongoing</option>
                        <option>Selected</option>
                        <option>Rejected</option>
                      </select>
                    )}
                  </td>
                  <td>{candidate.experience}</td>
                  <td style={{ position: "relative" }}>
                    <button
                      className="candidateActionBtn"
                      onClick={(e) => handleActionClick(e, idx)}
                    >
                      &#8942;
                    </button>
                    {actionmenu.visible && actionmenu.index === idx && (
                      <div className="actionMenu" ref={actionMenuRef}>
                        <div
                          className="actionMenuItem"
                          onClick={() => handleDownloadResume(candidate._id)}
                        >
                          Download Resume
                        </div>
                        <div key={candidate._id} className="candidateItem">
                          <div>{candidate.name}</div>
                          <div
                            className="actionMenuItem"
                            onClick={() => handleDeleteCandidate(candidate._id)}
                          >
                            Delete Candidate
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="candidateModalOverlay">
            <form className="candidateModalForm" onSubmit={handleSubmit}>
              <div className="candidateModalHeader">
                Add New Candidate
                <span
                  className="candidateModalClose"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </span>
              </div>
              <div className="candidateModalBody">
                <div className="candidateModalRow">
                  <div className="candidateModalCol">
                    <input
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Full Name *"
                      className="candidateModalInput redStar"
                    />
                  </div>
                  <div className="candidateModalCol">
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="Email Address *"
                      className="candidateModalInput"
                    />
                  </div>
                </div>

                <div className="candidateModalRow">
                  <div className="candidateModalCol">
                    <input
                      name="phone"
                      type="text"
                      required
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number *"
                      className="candidateModalInput"
                    />
                  </div>
                  <div className="candidateModalCol">
                    <select
                      name="position"
                      required
                      value={form.position}
                      onChange={handleInputChange}
                      className="candidateModalInput"
                    >
                      <option value="">Position *</option>
                      <option value="Designer">Designer</option>
                      <option value="Developer">Developer</option>
                      <option value="Human Resource">Human Resource</option>
                    </select>
                  </div>
                </div>

                <div className="candidateModalRow">
                  <div className="candidateModalCol">
                    <input
                      name="experience"
                      type="number"
                      required
                      value={form.experience}
                      onChange={handleInputChange}
                      placeholder="Experience *"
                      className="candidateModalInput"
                    />
                  </div>
                  <div className="candidateModalCol">
                    <div className="candidateModalFileWrap">
                      <input
                        name="documents"
                        type="file"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={handleInputChange}
                        placeholder="Resume *"
                        className="candidateModalInput"
                      />
                      <span className="candidateModalFileIcon">&#8682;</span>
                    </div>
                  </div>
                </div>

                <div className="candidateModalDeclaration">
                  <input
                    name="declaration"
                    type="checkbox"
                    checked={form.declaration}
                    onChange={handleInputChange}
                  />
                  <span className="candidateModalDeclarationText">
                    I hereby declare that the above information is true to the
                    best of my knowledge and belief
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!form.declaration}
                  className="candidateModalSaveBtn"
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

export default Candidate;
