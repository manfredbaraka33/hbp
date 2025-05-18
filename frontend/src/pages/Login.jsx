import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "react-bootstrap"; // Bootstrap spinner
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Start loading
    try {
      const response = await axios.post("https://hbpbackend.linkpc.net/api/token/", { username, password });
      const { access, refresh } = response.data;

      const userDetailsResponse = await axios.get("https://hbpbackend.linkpc.net/api/user/details/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      console.log(userDetailsResponse);
      const { profile_image, email, id,role } = userDetailsResponse.data;
      const userData = { id, username, access, refresh, profile_image, email,role };
      
      login(userData);
      localStorage.setItem("auth", JSON.stringify(userData));
     
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password. Please try again.");
      console.log(err)
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className=" shadow p-4 rounded mt-5 login-card" style={{ minWidth: "400px" }}>
        <h3 className="text-center mb-4 text-light">HBAnalytics Login</h3>
        {error && <div className="text-danger">{error}</div>}
        <form className="p-4 text-light" onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3 position-relative">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? <div className="mt-3 text-center">
                <div className="spinner-grow text-light" role="status"></div>
                <div className="spinner-grow text-danger" role="status"></div>
                <div className="spinner-grow text-success" role="status"></div>
                <div className="spinner-grow text-info" role="status"></div>
                <p>Logging in ...</p>
            </div> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
