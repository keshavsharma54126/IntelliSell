"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isSelected = pathname === href;

  return (
    <button
      onClick={() => router.push(href)}
      className={`
                flex items-center w-full p-2 pl-8 transition-colors duration-200
                ${
                  isSelected
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }
            `}
      aria-current={isSelected ? "page" : undefined}
    >
      <span className="pr-2">{icon}</span>
      <span className="font-medium">{title}</span>
    </button>
  );
};
