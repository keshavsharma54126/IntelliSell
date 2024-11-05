"use client";
import React, { useRef, useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  type: "line" | "bar";
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
    }[];
  };
}

export const Chart: React.FC<ChartProps> = ({ type, data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const { width } = chartRef.current.getBoundingClientRect();
        setChartWidth(width);
        setChartHeight(width * 0.6); // Adjust this ratio as needed
      }
    };

    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    updateDimensions();
    checkDarkMode();
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("theme-change", checkDarkMode);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("theme-change", checkDarkMode);
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDarkMode ? "#e4e4e7" : "#374151", // zinc-200 for dark, gray-700 for light
        },
      },
      title: {
        display: true,
        text: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
        color: isDarkMode ? "#e4e4e7" : "#374151", // zinc-200 for dark, gray-700 for light
      },
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? "rgba(228, 228, 231, 0.1)" : "rgba(0, 0, 0, 0.1)", // zinc-200 with opacity for dark
        },
        ticks: {
          color: isDarkMode ? "#e4e4e7" : "#374151", // zinc-200 for dark, gray-700 for light
        },
      },
      y: {
        grid: {
          color: isDarkMode ? "rgba(228, 228, 231, 0.1)" : "rgba(0, 0, 0, 0.1)", // zinc-200 with opacity for dark
        },
        ticks: {
          color: isDarkMode ? "#e4e4e7" : "#374151", // zinc-200 for dark, gray-700 for light
        },
      },
    },
  };

  // Adjust data colors for dark mode
  const adjustedData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderColor: isDarkMode ? "#818cf8" : "#3b82f6", // indigo-400 for dark, blue-500 for light
      backgroundColor: isDarkMode
        ? Array.isArray(dataset.backgroundColor)
          ? dataset.backgroundColor.map(() => "rgba(129, 140, 248, 0.5)") // indigo-400 with opacity
          : "rgba(129, 140, 248, 0.5)" // indigo-400 with opacity
        : dataset.backgroundColor,
    })),
  };

  return (
    <div
      ref={chartRef}
      className="w-full h-full bg-white dark:bg-zinc-800 p-4 rounded-lg"
    >
      <div style={{ width: chartWidth, height: chartHeight }}>
        {type === "line" ? (
          <Line data={adjustedData} options={options} />
        ) : (
          <Bar data={adjustedData} options={options} />
        )}
      </div>
    </div>
  );
};

export const LineChart: React.FC<Omit<ChartProps, "type">> = (props) => (
  <Chart type="line" {...props} />
);

export const BarChart: React.FC<Omit<ChartProps, "type">> = (props) => (
  <Chart type="bar" {...props} />
);
