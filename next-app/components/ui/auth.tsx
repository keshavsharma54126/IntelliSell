"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

const inputClasses =
  "w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mt-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300";
const buttonClasses =
  "w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-3 rounded-lg mt-6 transition duration-300 transform hover:-translate-y-1 hover:shadow-xl";

const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signUpSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPwd: z.string(),
  })
  .refine((data) => data.password === data.confirmPwd, {
    message: "Passwords must match",
    path: ["confirmPwd"],
  });

export const Signin = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [err, setErr] = useState<string | null>(null);
  const route = useRouter();
  const [visible, setVisible] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setErr(null);
  }

  async function handleSubmit() {
    try {
      signInSchema.parse(input);
      const res = await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirect: false,
      });

      if (!res?.error) {
        route.push("/projects");
      } else {
        setErr("Incorrect credentials!");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErr(error.errors[0].message);
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center p-6 font-sans"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-6">
          <h1 className="text-3xl font-bold text-white">Login</h1>
        </div>
        <div className="p-6 space-y-4">
          <div className="relative">
            <Mail className="absolute top-5 left-3 text-gray-400" size={20} />
            <input
              onChange={handleChange}
              className={`${inputClasses} pl-10`}
              name="email"
              placeholder="Enter email"
              type="email"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute top-5 left-3 text-gray-400" size={20} />
            <input
              onChange={handleChange}
              className={`${inputClasses} pl-10`}
              name="password"
              placeholder="Enter password"
              type={visible ? "text" : "password"}
              required
            />
            <button
              onClick={() => setVisible(!visible)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              type="button"
            >
              {visible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {err && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm mt-2"
            >
              {err}
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className={buttonClasses}
          >
            Login
          </motion.button>
          <div className="text-center mt-4">
            <span
              onClick={() => route.push("/signup")}
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-500 hover:underline cursor-pointer transition-colors"
            >
              Create account?
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Signup = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPwd: "",
  });

  const route = useRouter();
  const [visible, setVisible] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setErr(null);
  }

  async function handleSubmit() {
    try {
      signUpSchema.parse(input);
      await axios.post("/api/user", input);
      alert("Signup successful. Redirecting to Login page");
      route.push("/signin");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErr(error.errors[0].message);
      } else {
        setErr("An error occurred. Please try again.");
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center p-6 font-sans"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-6">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
        </div>
        <div className="p-6 space-y-4">
          <div className="relative">
            <Mail className="absolute top-5 left-3 text-gray-400" size={20} />
            <input
              onChange={handleChange}
              className={`${inputClasses} pl-10`}
              name="email"
              placeholder="Enter email"
              type="email"
              required
            />
          </div>
          <div className="relative mt-4">
            <Lock className="absolute top-5 left-3 text-gray-400" size={20} />
            <input
              onChange={handleChange}
              className={`${inputClasses} pl-10`}
              name="password"
              placeholder="Enter password"
              type={visible ? "text" : "password"}
              required
            />
            <button
              onClick={() => setVisible(!visible)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              type="button"
            >
              {visible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative mt-4">
            <Lock className="absolute top-5 left-3 text-gray-400" size={20} />
            <input
              onChange={handleChange}
              className={`${inputClasses} pl-10`}
              name="confirmPwd"
              placeholder="Confirm password"
              type={visible ? "text" : "password"}
              required
            />
            <button
              onClick={() => setVisible(!visible)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              type="button"
            >
              {visible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {err && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm mt-2"
            >
              {err}
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className={buttonClasses}
          >
            Sign Up
          </motion.button>
          <div className="text-center mt-4">
            <span
              onClick={() => route.push("/signin")}
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-500 hover:underline cursor-pointer transition-colors"
            >
              Already have an account?
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
