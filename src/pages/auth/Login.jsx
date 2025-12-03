import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const res = login(email, password); // CALL AUTHCONTEXT

    if (!res.success) {
      alert(res.message);
      return;
    }

    const user = res.user;

    // Redirect based on role
    if (user.role === "admin" || user.role === "dev") {
      navigate("/company");
    } else if (user.role === "client") {
      navigate("/client");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 card p-6">
      <h3 className="text-xl mb-6 text-center font-semibold">Log In</h3>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-sky-600 text-white rounded">
            Log In
          </button>
        </div>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?
        <Link to="/register" className="text-sky-600">
          {" "}
          Register here
        </Link>
      </p>
    </div>
  );
}
