import React, { useState, useEffect } from "react";
import { getStaticUsers } from "./staticFunctions";

const AdminUserList = () => {
  const [dynamicUsers, setDynamicUsers] = useState([]);
  const [staticUsers, setStaticUsers] = useState([]);

  // Fetch users from localStorage and static users
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const staticAccounts = getStaticUsers().map((user) => ({
      studentNumber: user.identifier, // Map identifier to studentNumber for consistency
      password: user.password,
      role: user.role,
    }));
    setDynamicUsers(storedUsers);
    setStaticUsers(staticAccounts);
  }, []);

  // Delete a user
  const handleDeleteUser = (index) => {
    const updatedUsers = [...dynamicUsers];
    updatedUsers.splice(index, 1);
    setDynamicUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("User deleted successfully.");
  };

  // Reset a user's password
  const handleResetPassword = (index) => {
    const newPassword = prompt("Enter a new password for this user:");
    if (newPassword) {
      const updatedUsers = [...dynamicUsers];
      updatedUsers[index].password = newPassword;
      setDynamicUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      alert("Password reset successfully.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Registered Users</h1>

      {/* Static Users Table */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Static Users</h2>
      <table className="table-auto border-collapse border border-gray-300 shadow-md mb-8">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border">Identifier</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Password</th>
          </tr>
        </thead>
        <tbody>
          {staticUsers.length > 0 ? (
            staticUsers.map((user, index) => (
              <tr key={index} className="bg-gray-200 text-gray-700">
                <td className="px-4 py-2 border">{user.studentNumber}</td>
                <td className="px-4 py-2 border">{user.role}</td>
                <td className="px-4 py-2 border">{user.password}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-2 border text-center">
                No static users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Dynamic Users Table */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Dynamic Users</h2>
      <table className="table-auto border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="px-4 py-2 border">Student Number</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Password</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dynamicUsers.length > 0 ? (
            dynamicUsers.map((user, index) => (
              <tr key={index} className="bg-white text-gray-700">
                <td className="px-4 py-2 border">{user.studentNumber}</td>
                <td className="px-4 py-2 border">{user.role}</td>
                <td className="px-4 py-2 border">{user.password}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleResetPassword(index)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => handleDeleteUser(index)}
                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-2 border text-center">
                No dynamic users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
