import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { Link } from "react-router-dom";

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Mini Jira</Link>

      <div className="flex items-center gap-4">
        <span>{user?.name}</span>

        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => dispatch(logoutUser())}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
