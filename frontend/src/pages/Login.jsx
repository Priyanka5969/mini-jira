import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useState } from "react";

export default function Login(){
    const [data, setData] = useState({email: "", password: ""});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submit = async(e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(data));
        if (loginUser.fulfilled.match(result)) {
            navigate("/");
        } else {
            const errorMsg = result.payload || result.error?.message || "Login failed. Please try again.";
            alert(errorMsg);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <form
            onSubmit={submit}
            className="bg-white p-8 shadow rounded w-full max-w-md space-y-4" 
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>
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
                    Login
                </button>
                <div className="text-center text-sm">
  Don’t have an account? <a href="/register" className="text-indigo-600">Register</a>
</div>
            </form>
        </div>
    );
}