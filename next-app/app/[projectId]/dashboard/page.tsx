import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, BarChart } from "@/components/ui/chart";
import Link from "next/link";
import Image from "next/image";
import { getProjectDetails } from "../../create/actions";
import axios from "axios";
import GenerateQr from "@/components/ui/generateQr";

export default async function Dashboard({
  params,
}: {
  params: { projectId: string };
}) {
  // Sample data for the charts
  const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const barChartData = {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        label: "Top Products",
        data: [300, 450, 200, 600],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const { projectId } = params;
  const project = await getProjectDetails(projectId);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background to-gray-100 dark:from-zinc-900 dark:to-zinc-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">
            Dashboard
          </h1>
          <Link href="/projects">
            <button className="flex items-center bg-primary-500 px-4 py-2 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-primary-600 hover:shadow-xl dark:bg-primary-600 dark:hover:bg-primary-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Projects
            </button>
          </Link>
        </div>

        <div className="mb-12">
          <Card className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Whatsapp QR Code for {project?.success?.project?.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Scan this QR code to get the whatsapp link of your project
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src={project?.success?.project?.qrCode || ""}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="mb-4"
                />
                <GenerateQr projectId={projectId} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Total Sales
            </h2>
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              $124,567
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              New Customers
            </h2>
            <p className="text-4xl font-bold text-secondary-600 dark:text-secondary-400">
              +256
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Conversion Rate
            </h2>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
              3.2%
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Sales Trend
            </h2>
            <div className="w-full h-80">
              <LineChart data={lineChartData} />
            </div>
          </Card>
          <Card className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Top Products
            </h2>
            <div className="w-full h-80">
              <BarChart data={barChartData} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
