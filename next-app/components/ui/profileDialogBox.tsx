import { editUserDetails } from "@/app/create/actions";
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
import { PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProfileDialogDemo({ profileId }: { profileId: string }) {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleEditProfile = async (id: string) => {
    try {
      editUserDetails({ fullName, companyName, phoneNumber, address });
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          onClick={(e) => {}}
          className="flex items-center p-2 text-white rounded-full transition-colors"
        >
          <PencilIcon className="h-6 w-6 text-primary-500 dark:text-primary-400 font-extrabold text-2xl hover:text-primary-600 dark:hover:text-primary-300 hover:scale-110" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-zinc-300">
            Enter the new details of your profile below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-black dark:text-white dark:bg-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="company"
              className="text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Company Name
            </Label>
            <Input
              id="company"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-black dark:text-white dark:bg-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-black dark:text-white dark:bg-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Address
            </Label>
            <textarea
              id="address"
              placeholder="Enter Address information"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="text-black dark:text-white w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 h-24 resize-none dark:bg-zinc-700"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              handleEditProfile(profileId);
              router.push("/projects");
            }}
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Edit Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
