"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function SigninFormDemo() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState(false);

  const route = useRouter();

  const [visible, setVisible] = useState(false);

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
    const res = await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirect: false,
    });

    if (!res?.error) {
      route.push("/projects");
    } else {
      setErr(true);
    }
  }
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-zinc-900">
      <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
        Login
      </h2>

      {/* <form className="my-8" onSubmit={handleSubmit}> */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        {/* <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer> */}
      </div>
      <LabelInputContainer className="mb-2">
        <Input
          className="text-lg dark:bg-zinc-800 dark:text-white"
          onChange={handleChange}
          name="email"
          id="email"
          placeholder="Enter email"
          type="email"
        />
      </LabelInputContainer>
      <LabelInputContainer className="mb-6">
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

      <button
        className="bg-gradient-to-br text-md relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        type="submit"
        onClick={handleSubmit}
      >
        Login &rarr;
        <BottomGradient />
      </button>

      {/* <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" /> */}

      {/* <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              OnlyFans
            </span>
            <BottomGradient />
          </button>
        </div> */}
      {/* </form> */}
      <div className=" mt-4 text-lg text-gray-500 dark:text-gray-400 flex justify-center">
        Don't have an account?
        <Link
          href="/signup"
          className="text-blue-500 dark:text-blue-400 ml-2 underline"
        >
          Sign up
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
