import React, { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // REAL LOGIN CHECK
    if (email === "somisettysivateja@gmail.com" && password === "1385") {
      onLogin();
    } else {
      setErr("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl mb-6 text-center font-semibold text-gray-800 dark:text-gray-200">
          SmartStock Login
        </h2>

        {err && (
          <p className="mb-4 text-red-500 text-sm text-center">
            {err}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
