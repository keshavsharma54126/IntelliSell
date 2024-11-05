"use client";
import { Appbar } from "@/components/ui/Appbar";
import { Menu } from "@/components/ui/Menu";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const pathName = usePathname();
  const projectId = pathName.split("/")[1];
  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-50">
        <Appbar />
      </div>
      <div className="flex-1 ">
        <Menu projectId={projectId}>
          <main className="p-6 h-full">{children}</main>
        </Menu>
      </div>
    </div>
  );
}
