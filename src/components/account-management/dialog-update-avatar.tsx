"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoCameraSharp } from "react-icons/io5";
import { ChangeEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export function DialogUpdateAvatar({ setFile, file }: Props) {
  const { data: session } = useSession();
  const [preview, setPreview] = useState<string | null>(null);

  // Cập nhật ảnh preview khi `file` thay đổi
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Cleanup URL khi component unmount
    } else {
      setPreview(null);
    }
  }, [file]);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 701680) {
      alert("File is too big!");
      return;
    }

    setFile(selectedFile);
  }

  function handleSave() {
    console.log("Saved avatar:", preview);
  }

  return (
    <div className="relative h-20 w-20 mx-auto">
      <img
        src={preview || session?.user.avatar}
        alt="Avatar"
        className="rounded-full h-full w-full object-cover"
      />
      <Dialog>
        <DialogTrigger asChild>
          <IoCameraSharp
            className="absolute bottom-0 right-0 text-white bg-black rounded-full p-1 cursor-pointer z-10 hover:bg-gray-700 hover:scale-110 transition-all duration-200 ease-in-out"
            style={{ fontSize: "1.5rem" }}
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Avatar</DialogTitle>
            <DialogDescription>
              Choose a new image for your avatar.
            </DialogDescription>
          </DialogHeader>

          {/* Input chọn ảnh */}
          <div className="flex flex-col items-center gap-4">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 rounded-full object-cover border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="border p-2 rounded"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={handleSave}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
