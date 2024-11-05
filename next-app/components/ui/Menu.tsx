"use client";

import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiChartPie, HiTable } from "react-icons/hi";
import Link from "next/link";
import { SettingsIcon as SettingsIconLucide } from "lucide-react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";

import { SidebarBody, SidebarLink } from "./Sidebar";
import { motion } from "framer-motion";
import { SidebarProvider } from "./Sidebar";
import user from "../../images/user.png";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/dashboard", icon: HiChartPie, label: "Dashboard" },
  { href: "/upload", icon: HiTable, label: "Upload" },
  { href: "/settings", icon: SettingsIconLucide, label: "Settings" },
];

export function Menu({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const links = [
    {
      label: "Dashboard",
      href: `/${projectId}/dashboard`,
      icon: <IconBrandTabler className=" h-6 w-6 flex-shrink-0" />,
    },
    {
      label: "Upload",
      href: `/${projectId}/upload`,
      icon: <IconUserBolt className="h-6 w-6  flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: `/${projectId}/settings`,
      icon: <IconSettings className="h-6 w-6  flex-shrink-0" />,
    },
  ];
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div className="flex overflow-hidden h-screen">
      <SidebarProvider>
        <Sidebar className="flex flex-col justify-between  w-30">
          <SidebarBody className="flex flex-col justify-between ">
            <div className="flex flex-col flex-1 overflow-y-auto">
              {/* {open ? <Logo /> : <LogoIcon />} */}
              <div className=" flex flex-col gap-2">
                {links.map((link, idx) => (
                  <div
                    key={idx}
                    className={
                      pathname === link.href
                        ? "text-primary-500"
                        : "text-neutral"
                    }
                  >
                    <SidebarLink key={idx} link={link} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-14">
              <SidebarLink
                link={{
                  label: "",
                  href: "/user",
                  icon: (
                    <img
                      src={user.src}
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </SidebarProvider>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
