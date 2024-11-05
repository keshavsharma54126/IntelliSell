"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  DownloadCard,
} from "@/components/ui/card";
import { FileIcon, DownloadIcon, ExternalLinkIcon } from "lucide-react";
// import {downloadFileFromS3} from "@/app/create/actions"

interface DownloadableContentProps {
  title: string;
  fileType: string;
  fileSize: string;
  previewUrl?: string;
  downloadUrl: string;
}

export default function Component(
  {
    title,
    fileType,
    fileSize,
    previewUrl,
    downloadUrl,
  }: DownloadableContentProps = {
    title: "Sample Document",
    fileType: "PDF",
    fileSize: "2.5 MB",
    previewUrl: "/placeholder.svg?height=200&width=200&text=Preview",
    downloadUrl: "/sample-document.pdf",
  }
) {
  const [isHovered, setIsHovered] = useState(false);

  const safeTitle = title || "Untitled Document";
  const fileName = safeTitle.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="shadow-lg rounded-lg overflow-hidden"
    >
      <DownloadCard
        className="w-full max-w-sm bg-primary-100 text-primary-900 overflow-hidden border border-primary-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h2></h2>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <motion.div
              className="rounded-full bg-primary-100 p-3"
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
            >
              <FileIcon className="h-6 w-6 text-primary-500" />
            </motion.div>
            <div>
              <motion.h3
                className="font-semibold text-xl"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {safeTitle}
              </motion.h3>
              <p className="text-sm text-primary-500">
                {fileType} - {fileSize}
              </p>
            </div>
          </div>
          {previewUrl && (
            <motion.div
              className="rounded-md overflow-hidden mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <img
                src={previewUrl}
                alt={`Preview of ${safeTitle}`}
                className="w-full h-40 object-cover"
              />
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center p-6 pt-0">
          <Button asChild variant="outline" size="sm">
            <motion.a
              href={downloadUrl}
              download={fileName}
              className="inline-flex items-center justify-center px-4 py-2 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DownloadIcon className="mr-2 h-5 w-5" />
              Download
            </motion.a>
          </Button>
        </CardFooter>
      </DownloadCard>
    </motion.div>
  );
}
