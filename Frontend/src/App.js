import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import StudentLoginCard from "./pages/Student/StudentLoginCard";
import Dashboard from "./pages/Student/Dashboard";
import RegisterForm from "./pages/Student/RegisterForm";
import COR from "./pages/Student/COR";
import Checklist from "./pages/Student/Checklist";
import StudentProfile from "./pages/Student/StudentProfile";

import RegistrarLoginCard from "./pages/Registrar/RegistrarLoginCard";
import RegistrarDashboard from "./pages/Registrar/RegistrarDashboard";
import EnrollmentList from "./pages/Registrar/EnrollmentList";
import ListOfStudents from "./pages/Registrar/ListOfStudents";
import RegistrarAccounts from "./pages/Registrar/RegistrarAccounts";
import EnrollStudent from "./pages/Registrar/EnrollStudent";
import Billing from "./pages/Registrar/Billing";
import EvaluatePayment from "./pages/Registrar/EvaluatePayment";
import EvaluateStudent from "./pages/Department/EvaluateStudent";
import CertificateOfRegistration from "./pages/Registrar/CertificateOfRegistration";

import AdvisingStudent from "./pages/Department/AdvisingStudent";
import DepartmentLoginCard from "./pages/Department/DepartmentLoginCard";
import DepartmentDashboard from "./pages/Department/DepartmentDashboard";
import DepartmentInstructorList from "./pages/Department/DepartmentInstructorList";
import DepartmentStudentList from "./pages/Department/DepartmentStudentList";
import DepartmentAccount from "./pages/Department/DepartmentAccount";
import DepartmentMasterList from "./pages/Department/DepartmentMasterlist"; // Import the new component

import AdminUserList from "./StaticFunctions/AdminUserList";

import { validateCredentials } from "./StaticFunctions/staticFunctions";
import ProtectedRoute from "./components/ProtectedRoute";

import PageNotFound from "./pages/404page/PageNotFound"; // Import the custom 404 component
import axios from "axios";
import ResetPassword from "./components/ResetPassword";
import ForgetPassword from "./components/ForgetPassword";
import { useAlert } from "./components/Alert";

function App() {
  const [user, setUser] = useState(null); // Holds user information
  const [role, setRole] = useState(null); // Tracks user role
  const {triggerAlert} = useAlert();

  const handleLogin = async (username, password, group) => {
    if (!username || !password) {
      return { error: "Username and password must be filled." };
    }

    try {
      const res = await axios.post(`/api/login/${group}/`, {
        username,
        password,
      });
      if(res?.data?.success) triggerAlert("success", "Success", "Login Successfully");
      return res.data; // Return the successful response data
    } catch (err) {
      return err.response.data;
    }
  };

  // For logging out all users
  const handleLogout = async () => {
    try {
      const logoutUrl = `/api/logout/`;

      const res = await axios.post(logoutUrl);

      // Redirect after successful logout
      if (res?.data?.success) {
        // // console.log(); // For debugging
        // // window.location.reload();
        // <Navigate to={`/${res?.data?.group}/`} />; // Navigate to the group's page
        triggerAlert("success", "Success", "Logout Successfully");
      }
    } catch (error) {
      // Handle any errors that occur during the axios request
      console.log(
        "Logout Failed:",
        error.response?.data?.detail || error.message
      );
      triggerAlert("error", "Logout Failed", error.response?.data?.detail || error?.message || "An error occured");
    }
  };

  // Redirect Component
  const RedirectToAdmin = () => {
    window.location.href = "http://127.0.0.1:8000/admin/login/";
    return null; // Return null since we don't render anything
  };

  return (
    <Router>
      <Routes>
        {/* Redirect root to appropriate login */}
        <Route path="/" element={<Navigate to="/student" />} />

        {/* Student Routes */}
        <Route
          path="/student"
          element={<StudentLoginCard onLogin={handleLogin} />}
        />
        <Route
          path="/reset-password/:userId/:token/"
          element={<ResetPassword />}
        />
        <Route
          path="/forget-password"
          element={<ForgetPassword />}
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute group="student">
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/cor"
          element={
            <ProtectedRoute group="student">
              <COR onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/checklist"
          element={
            <ProtectedRoute group="student">
              <Checklist onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute group="student">
              <StudentProfile onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="/student/register" element={<RegisterForm />} />

        {/* Registrar Routes */}
        <Route
          path="/registrar"
          element={<RegistrarLoginCard onLogin={handleLogin} />}
        />
        <Route
          path="/registrar/dashboard"
          element={
            <ProtectedRoute group="registrar">
              <RegistrarDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar/enrollmentList"
          element={
            <ProtectedRoute group="registrar">
              <EnrollmentList onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar/studentList"
          element={
            <ProtectedRoute group="registrar">
              <ListOfStudents onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar/account"
          element={
            <ProtectedRoute group="registrar">
              <RegistrarAccounts onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar/enroll-student/:studentId?"
          element={
            <ProtectedRoute group="registrar">
              <EnrollStudent onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar/billing/:studentId?"
          element={
            <ProtectedRoute group="registrar">
              <Billing onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar/evaluate-payment"
          element={
            <ProtectedRoute group="registrar">
              <EvaluatePayment onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar/certificate-of-registration/:studentId?"
          element={
            <ProtectedRoute group="registrar">
              <CertificateOfRegistration onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Department Routes */}
        <Route
          path="/department"
          element={<DepartmentLoginCard onLogin={handleLogin} />}
        />
        <Route
          path="/department/dashboard"
          element={
            <ProtectedRoute group="department">
              <DepartmentDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/department/departmentInstructorList"
          element={
            <ProtectedRoute group="department">
              <DepartmentInstructorList onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/department/departmentStudentList"
          element={
            <ProtectedRoute group="department">
              <DepartmentStudentList onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/department/evaluate-student/:studentId?"
          element={
            <ProtectedRoute group="department">
              <EvaluateStudent onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/department/departmentMasterList"
          element={
            <ProtectedRoute group="department">
              <DepartmentMasterList onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/department/departmentAccount"
          element={
            <ProtectedRoute group="department">
              <DepartmentAccount onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/department/advisingStudent/:studentId?"
          element={
            <ProtectedRoute group="department">
              <AdvisingStudent onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Admin User List */}
        <Route path="/admin" element={<RedirectToAdmin />} />

        {/* Catch-all Route for 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
