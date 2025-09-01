"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Head from "next/head"; // ✅ import Head
import api from "../../utils/api";
import useAuthStore from "../../store/authStore";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/login/", { email, password });
      login(res.data.user, res.data.access);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | My Notes App</title>
        <meta name="description" content="Sign in to access your private notes securely." />
        <meta name="keywords" content="notes, secure notes, login, productivity, personal notes" />
        
        {/* Open Graph / Social Sharing */}
        <meta property="og:title" content="Sign In | My Notes App" />
        <meta property="og:description" content="Sign in to access your private notes securely." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.yourdomain.com/login" />
        <meta property="og:image" content="https://www.yourdomain.com/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sign In | My Notes App" />
        <meta name="twitter:description" content="Sign in to access your private notes securely." />
        <meta name="twitter:image" content="https://www.yourdomain.com/og-image.png" />
      </Head>

      <main className="p-8 flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          className="w-full max-w-md bg-white p-6 rounded-lg shadow"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold mb-4 text-center">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-3">
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
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              Login
            </button>
            <p className="text-center mt-2">
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Signup
              </span>
            </p>
          </form>
        </motion.div>
      </main>
    </>
  );
}
