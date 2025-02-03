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
import Avatar from "react-avatar-edit";
import { ChangeEvent, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
interface Pros{
    setFile:React.Dispatch<React.SetStateAction<File | null>>
}
export function DialogUpdateAvatar({setFile}:Pros) {
    const [preview, setPreview] = useState<string>("/avatar.jpg");
    const [currentAvatar, setCurrentAvatar] = useState<string>("/avatar.jpg");
    const { toast } = useToast();

    function onCrop(preview: string) {
        setPreview(preview);
    }

    function onClose() {
        setPreview("");
    }

    function onBeforeFileLoad(elem: ChangeEvent<HTMLInputElement>) {
        const fileSelected = elem.target.files![0]
        if (fileSelected.size > 701680) {
            alert("File is too big!");
            elem.target.value = "";
        }else{

        
            setFile(fileSelected)
            console.log(fileSelected)
        }
        
    }

    function handleSave() {
        if (preview) {
            setCurrentAvatar(preview);

            // toast({ title: "Avatar updated", description: "Your avatar has been updated successfully" });
            // console.log("Saved avatar:", preview);
        }
    }

    return (
        <>
            <div className="relative h-20 w-20 mx-auto">
                <img src={currentAvatar} alt="Avatar" className="rounded-full h-full w-full object-cover" />
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
                                Make changes to your avatar here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <Avatar
                                width={390}
                                height={200}
                                imageWidth={390}
                                onCrop={onCrop}
                                onClose={onClose}
                                onBeforeFileLoad={onBeforeFileLoad}
                                src="/avatar.jpg"
                                label="Choose an image"
                                backgroundColor="#f5f5f5"
                                shadingOpacity={0.3}
                                cropColor="#000"
                                closeIconColor="#fff"
                                labelStyle={{ color: "#000" }}
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
        </>
    );
}
