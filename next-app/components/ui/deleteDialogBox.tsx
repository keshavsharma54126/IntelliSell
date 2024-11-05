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
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteDeleteDialogBox({ projectId }: { projectId: string }) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const router = useRouter();
  const handleDeleteProject = async (id: string) => {
    try {
      const res = await axios.post(`/api/projects/deleteProject`, {
        projectId: id,
      });
      window.location.reload();
    } catch (e) {
      console.log("error while deleting project", e);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center p-2 text-white rounded-full transition-colors">
          <TrashIcon className="h-6 w-6 text-red-600 hover:text-red-700 hover:scale-110" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary-600 mb-2">
            Do you want to delete this project?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-4">
          <DialogTrigger>
            <Button variant="outline" className="text-black hover:bg-gray-200">
              No
            </Button>
          </DialogTrigger>
          <Button
            onClick={() => {
              handleDeleteProject(projectId);
              router.push("/projects");
            }}
            type="submit"
            className=" bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
