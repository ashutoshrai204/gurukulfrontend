import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";
import "./users.css"

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.mainrole !== "superadmin") return navigate("/");

  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUsers(data.users);
    } catch (error) {
      console.log("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id) => {
    if (window.confirm("Are you sure you want to update this user role?")) {
      try {
        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          {}, // No data payload
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        console.log("Error updating role:", error);
        const errorMessage = error.response?.data?.message || "Role update failed.";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Layout>
      <div className="users">
        <h1 className="admin-ttitle">All Users</h1>
        <table border="1">
          <thead>
            <tr>
              <td>#</td>
              <td>Name</td>
              <td>Email</td>
              <td>Role</td>
              <td>Update Role</td>
            </tr>
          </thead>
          <tbody>
            {users.map((e, i) => (
              <tr key={e._id}>
                <td>{i + 1}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.role}</td>
                <td>
                  <button
                    onClick={() => updateRole(e._id)}
                    className="comman-btn"
                  >
                    Update Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdminUsers;
