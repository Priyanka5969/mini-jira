import React, { useState } from "react";
import { registerUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigate("/");
    } else {
      const errorMsg = result.payload || result.error?.message || "Registration failed. Please try again.";
      alert(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form
        onSubmit={submit}
        className="bg-white p-8 shadow rounded w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Register
        </button>

      </form>
    </div>
  );
}
