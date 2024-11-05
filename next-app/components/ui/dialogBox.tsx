import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DialogDemo({}) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const router = useRouter();
  const handleAddProject = async () => {
    try {
      const res = await axios.post("/api/projects/createProject", {
        projectName,
        projectDescription,
      });
      console.log(res.data.message);
    } catch (e) {
      console.error("error while creating project", e);
    } finally {
      window.location.reload();
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
          <PlusIcon className="w-6 h-6 mr-2" />
          Create New Project
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-zinc-300">
            Enter the details of your new project. We'll take care of the rest.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Project Name
            </Label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-black dark:text-white dark:bg-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Project Description
            </Label>
            <textarea
              id="description"
              placeholder="Enter project description"
              value={projectDescription}
              onChange={(e) => {
                setProjectDescription(e.target.value);
              }}
              className="text-black dark:text-white w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 h-24 resize-none dark:bg-zinc-700"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              handleAddProject();
              router.push("/projects");
            }}
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
