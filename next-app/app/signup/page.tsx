"use client";
import { Signup } from "@/components/ui/auth";
import { SignupFormDemo } from "@/components/ui/newSignupPage";
export default function SignupPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Signup />
      {/* <SignupFormDemo /> */}
    </div>
  );
}
