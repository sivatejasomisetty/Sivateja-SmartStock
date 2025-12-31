// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const { loadUser } = useAuth(); 

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC2a19yfh-1kBLijEAqfd0LmmMueMnTpzk",
//         {
//           email,
//           password,
//           returnSecureToken: true,
//         }
//       );

//       // 🔐 Store token
//       localStorage.clear();
//       localStorage.setItem("token", res.data.idToken);
//       localStorage.setItem("role", res.data.role);
//     localStorage.setItem("store_id", res.data.store_id || "");


//       await loadUser();

//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       console.error("LOGIN ERROR FULL:", err.response?.data || err);
//       setError(err.response?.data?.error?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-sm"
//       >
//         <h2 className="text-3xl mb-6 text-center font-semibold">
//           SmartStock Login
//         </h2>

//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full mb-4 p-3 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-6 p-3 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-3 rounded-lg text-white ${
//             loading ? "bg-gray-400" : "bg-blue-600"
//           }`}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Login;







//--------------- Testing------------------
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loadUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Firebase authentication
      const res = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC2a19yfh-1kBLijEAqfd0LmmMueMnTpzk",
        {
          email,
          password,
          returnSecureToken: true,
        }
      );

      // 2️⃣ Store ONLY the token
      localStorage.clear();
      localStorage.setItem("token", res.data.idToken);

      // 3️⃣ Load role & store_id from YOUR backend
      await loadUser();

      // 4️⃣ Navigate
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("LOGIN ERROR FULL:", err.response?.data || err);
      setError(err.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-3xl mb-6 text-center font-semibold">
          SmartStock Login
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
