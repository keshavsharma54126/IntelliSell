"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function SignupFormDemo() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPwd: "",
  });

  const route = useRouter();
  const [visible, setVisible] = useState(false);
  const [match, setMatch] = useState(true);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setInput((prev: any) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleSubmit() {
    if (input.password !== input.confirmPwd) {
      setMatch(false);
      return;
    }
    try {
      await axios.post("/api/user", input);
      alert("Signup successful. Redirecting to Login page");
      route.push("/signin");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-zinc-900">
      <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
        SignUp
      </h2>

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        {/* <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer> */}
      </div>
      <LabelInputContainer className="mb-4">
        <Input
          className="text-lg dark:bg-zinc-800 dark:text-white"
          onChange={handleChange}
          name="email"
          id="email"
          placeholder="Enter email"
          type="email"
        />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <div className="relative mt-4">
          <Input
            name="password"
            onChange={handleChange}
            id="password"
            placeholder="Enter password"
            type={visible ? "text" : "password"}
            className="text-lg dark:bg-zinc-800 dark:text-white"
            required
          />
          <button
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300"
            type="button"
          >
            {visible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </LabelInputContainer>
      <LabelInputContainer className="mb-8">
        <div className="relative mt-4">
          <Input
            id="confirmPwd"
            placeholder="Confirm password"
            type={visible ? "text" : "password"}
            name="confirmPwd"
            onChange={handleChange}
            required
            className="text-lg dark:bg-zinc-800 dark:text-white"
          />
          <button
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300"
            type="button"
          >
            {visible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </LabelInputContainer>

      <button
        className="bg-gradient-to-br text-md relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        type="submit"
        onClick={handleSubmit}
      >
        Sign up &rarr;
        <BottomGradient />
      </button>

      <div className="mt-4 text-lg text-gray-500 dark:text-gray-400 flex justify-center">
        Already have an account?
        <Link
          href="/signin"
          className="text-blue-500 dark:text-blue-400 ml-2 underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
