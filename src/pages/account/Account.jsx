import React from "react";
import "./account.css";
import { MdDashboard } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const { setisAuth, setUser } = UserData();

  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setisAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };
  return (
    <div>
      {user && (
        <div className="profile">
          <h2>My Profile</h2>
          <div className="profile-info">
            <p>
              <strong>Name - {user.name}</strong>
            </p>
            <p>
              <strong>Email - {user.email}</strong>
            </p>

            <button
              onClick={() => navigate(`/${user._id}/dashboard`)}
              className="comman-btn"
            >
              <MdDashboard /> Dashboard
            </button>

            <br />

            {user.role === "admin" && (
              <button
                onClick={() => navigate(`/admin/dashboard`)}
                className="comman-btn"
              >
                <MdDashboard /> Admin Dashboard
              </button>
            )}

            <button onClick={logoutHandler} className="comman-btnn">
              {" "}
              <CiLogout /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
