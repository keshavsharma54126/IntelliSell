"use client";
import React from "react";
import { Signin } from "@/components/ui/auth";
import { SigninFormDemo } from "@/components/ui/newSigninPage";

export default function SigninPage() {
  return (
    <>
      <Signin />
      {/* <div className="w-screen h-screen flex justify-center items-center">
        <SigninFormDemo />
      </div> */}
    </>
  );
}
