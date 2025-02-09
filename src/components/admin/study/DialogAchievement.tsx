"use client";
import { LoadingSpinner } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import React, { Suspense, useEffect, useState } from 'react'
import { z } from 'zod';
import { usePrivate } from '@/hooks/usePrivateAxios';
import { useSearchParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/redux/hooks';
import { addAchievement, updateAchievement } from '@/redux/slices/achievementSlice';
import { IAchievement } from '@/types/IAchievement';
const formSchema = z.object({
    title: z.string().min(1, {
        message: "required",
    }),
    requiredScore: z.number().min(1, {
        message: "required",
    }),
    image: z
        //Rest of validations done via react dropzone
        .instanceof(File)
        .refine((file) => file.size !== 0, "Please upload an image")
        .optional(), // Thêm optional()

        
})

const requiredScoreOptions = [
    { value: 25, label: "25" },
    { value: 50, label: "50" },
    { value: 75, label: "75" },
    { value: 100, label: "100" },
    { value: 125, label: "125" },
    { value: 150, label: "150" },
]

type TProps = {
    achievement?: IAchievement;
}

export default function DialogAchievement(props: TProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            title: "",
            requiredScore: 0,
            image: typeof window !== 'undefined' ? new File([""], "filename") : undefined,
        },
    });
    const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");
    const searchParams = useSearchParams();
    const courseId = searchParams.get("id") || "algorithm";
    const axiosPrivate = usePrivate();
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const baseImageURL = `${process.env.NEXT_PUBLIC_BACKEND_UPLOAD_URL}/achievements`;
    useEffect(() => {
        if (isDialogOpen) {
            form.setFocus("title"); // This ensures the title input is focused when the dialog opens
        }
    }, [isDialogOpen]);
    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            const reader = new FileReader();
            try {
                reader.onload = () => setPreview(reader.result);
                reader.readAsDataURL(acceptedFiles[0]);
                form.setValue("image", acceptedFiles[0]);
                form.clearErrors("image");
            } catch (error) {
                setPreview(null);
                form.resetField("image");
            }
        },
        [form],
    );

    useEffect(() => {
        if (props.achievement && Object.keys(props.achievement).length > 1) {
            form.reset({
                title: props.achievement.title || "",
                requiredScore: props.achievement.requiredScore || 0,
            });
        } else {
            form.reset({
                title: "",
                requiredScore: 0,
                image: typeof window !== 'undefined' ? new File([""], "filename") : undefined,
            });
        }
    }, [props.achievement]);
    const { getRootProps, getInputProps, isDragActive, fileRejections } =
        useDropzone({
            onDrop,
            maxFiles: 1,
            maxSize: 1000000,
            accept: { "image/png": [], "image/jpg": [], "image/jpeg": [], "image/svg+xml": [] },
        });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        if (props.achievement) {
            try {
                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("requiredScore", values.requiredScore.toString());
                if (values.image instanceof File) {
                    formData.append("image", values.image);
                } else {
                    throw new Error("Invalid image file.");
                }
                const response = await axiosPrivate.patch(`/achievement/${props.achievement._id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data", // Set the correct content type
                    },
                })

                dispatch(updateAchievement(response.data.data));

                setIsDialogOpen(false);
                toast({
                    title: "Success",
                    description: "Achievement updated successfully",
                    variant: "success",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to update achievement",
                    variant: "error",
                });
            }
            return;
        }
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("requiredScore", values.requiredScore.toString());
            formData.append("refId", courseId as string);
            if (values.image instanceof File) {
                formData.append("image", values.image);
            } else {
                throw new Error("Invalid image file.");
            }
            const response = await axiosPrivate.post(`/achievement`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Set the correct content type
                },
            })

            dispatch(addAchievement(response.data.data));



            setIsDialogOpen(false);
            toast({
                title: "Success",
                description: "Achievement created successfully",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create achievement",
                variant: "error",
            });
        }

    }
    return (
        <Suspense fallback={<div>...</div>}>
             <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (isOpen) {
                form.reset(); // Reset the form when the dialog opens
                setPreview(null); // Reset the image preview (if applicable)
            }
        }}>
            <DialogTrigger asChild>
                {props.achievement ? (
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDialogOpen(true);
                        }}
                    >
                        Edit
                    </span>
                ) : (
                    <Button
                        variant="default"
                        size="default"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Create Achievement
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle> {props.achievement ? "Edit Achievement" : "Create Achievement"}</DialogTitle>
                    <DialogDescription>
                        {props.achievement ? "Change the details below to edit achievement." : "Fill in the details below to create a new achievement."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter title" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="requiredScore"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Required Score</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value.toString()}
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                        >
                                            <SelectTrigger  >
                                                <SelectValue placeholder="Select a score" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {requiredScoreOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value.toString()}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={() => (
                                <FormItem className="mx-auto md:w-1/2">
                                    <FormLabel
                                        className={`${fileRejections.length !== 0 && "text-destructive"
                                            }`}
                                    >
                                        <h2 className="text-xl font-semibold tracking-tight">
                                            Upload your image
                                            <span
                                                className={
                                                    form.formState.errors.image || fileRejections.length !== 0
                                                        ? "text-destructive"
                                                        : "text-muted-foreground"
                                                }
                                            ></span>
                                        </h2>
                                    </FormLabel>
                                    <FormControl>
                                        <div
                                            {...getRootProps()}
                                            className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground"
                                        >
                                            {preview ? (
                                                <img
                                                    src={preview as string}
                                                    alt="Uploaded image"
                                                    className="max-h-[400px] rounded-lg"
                                                />
                                            ) : props.achievement && <img
                                                src={`${baseImageURL}/${props.achievement.image}`}
                                                alt="Uploaded image"
                                                className="max-h-[400px] rounded-lg"
                                            />}
                                            <ImagePlus
                                                className={`size-40 ${preview || props.achievement ? "hidden" : "block"}`}
                                            />
                                            <Input {...getInputProps()} type="file" />
                                            {isDragActive ? (
                                                <p>Drop the image!</p>
                                            ) : (
                                                <p>Click here or drag an image to upload it</p>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage>
                                        {fileRejections.length !== 0 && (
                                            <p>
                                                Image must be less than 1MB and of type png, jpg, jpeg or svg
                                            </p>
                                        )}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}
                                onClick={(e) => { e.stopPropagation(); }}
                            >
                                {form.formState.isSubmitting ? <LoadingSpinner /> : props.achievement ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>


            </DialogContent>
        </Dialog>
        </Suspense>
       
    )
}
