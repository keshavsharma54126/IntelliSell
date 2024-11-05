"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export default function GenerateQr({ projectId }: { projectId: string }) {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={async () => {
          await axios.post("http://localhost:4000/initializeClient", {
            projectId,
          });
          window.location.reload();
        }}
        className="bg-primary-500 px-4 py-2 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-primary-600 hover:shadow-xl dark:bg-primary-600 dark:hover:bg-primary-700"
      >
        Generate QR Code
      </button>
    </div>
  );
}
