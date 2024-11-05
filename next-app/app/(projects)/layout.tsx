import { Appbar } from "@/components/ui/Appbar";
import { Menu } from "@/components/ui/Menu";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Appbar />
      </div>
      <div className="flex flex-1 bg-white `">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
