"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const users = [
    { email: "admin@fleet.com", password: "admin123", role: "admin" },
    { email: "employee@fleet.com", password: "emp123", role: "employee" },
    { email: "driver@fleet.com", password: "driver123", role: "driver" },
    { email: "manager@fleet.com", password: "mgr123", role: "manager" },
    { email: "hod@fleet.com", password: "hod123", role: "hod" },
    {
      email: "vehicleadmin@fleet.com",
      password: "va123",
      role: "vehicleadmin",
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    setError("");

    switch (user.role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "employee":
        router.push("/employee/dashboard");
        break;
      case "driver":
        router.push("/driver/dashboard");
        break;
      case "manager":
        router.push("/manager/dashboard");
        break;
      case "hod":
        router.push("/hod/dashboard");
        break;
      case "vehicleadmin":
        router.push("/vehicleadmin/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    const demoUser = users.find(
      (u) => u.email === demoEmail && u.password === demoPassword
    );
    if (demoUser) {
      router.push(`/${demoUser.role.replace(" ", "-")}/dashboard`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 rounded-lg shadow-md border dark:border-gray-800 border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-sky-400 text-center">
        Login
      </h1>

      {error && (
        <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
      )}

      <form onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium dark:text-gray-100">
            Username
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-3 block w-full rounded-md border border-gray-500 shadow-sm text-xs p-3 dark:text-gray-400 mb-5"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-100">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-3 block w-full rounded-md border border-gray-500 shadow-sm text-xs p-3 dark:text-gray-400"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center justify-between mt-4 text-xs dark:text-gray-100">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-500 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent bg-sky-600 rounded-2xl mt-5 text-black font-bold cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
