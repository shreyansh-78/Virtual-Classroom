import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar"; // Adjust path as per your project structure
import "./style.scss";
import axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage
        const response = await axios.get("/api/users/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="students-page">
      {/* Include Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="students-container">
        <h2>All Students</h2>

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <ul className="students-list">
            {students.map((student) => (
              <li key={student._id} className="student-item">
                <p>{student.fullname}</p>
                <p>{student.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Students;
