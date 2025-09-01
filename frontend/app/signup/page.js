"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // ✅ import framer-motion
import api from "../../utils/api";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/register/", {
        user_email: email,
        user_name: name,
        password,
      });

      alert("Registered successfully! Please sign in.");
      router.push("/login");
    } catch (err) {
      console.error("Register failed:", err);
      const message =
        err.response?.data?.error || "Something went wrong. Please try again.";
      alert(message);
    }
  };

  return (
    <main className="p-8 flex justify-center items-center min-h-screen bg-gray-50">
      <motion.div
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="border p-2 w-full rounded"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="border p-2 w-full rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border p-2 w-full rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
            Register
          </button>
          <p className="text-center mt-2">
            already have account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              signin
            </span>
          </p>
        </form>
      </motion.div>
    </main>
  );
}
