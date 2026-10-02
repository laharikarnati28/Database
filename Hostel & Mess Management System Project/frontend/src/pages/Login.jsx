import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            const data = await login(
                email,
                password
            );

            const role = data.user.role;

            if (role === "student") {
                navigate("/student");
            } else if (role === "warden") {
                navigate("/warden");
            } else if (role === "admin") {
                navigate("/admin");
            }

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Login failed";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <h1>
                        Hostel Management
                    </h1>

                    <p>
                        Sign in to your account
                    </p>

                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your email"
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your password"
                        />

                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Login;