import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { DialogUpdateAvatar } from "./dialog-update-avatar";

const personalInfoFormSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    name: z.string().min(1, { message: "Required" }),
});

export default function PersonalInfoForm() {
    const { toast } = useToast();
    const defaultValuesPersonalInfo = {
        email: "m@gmail.com",
        name: "devarena192302",
    };
    const personalInfoForm = useForm<z.infer<typeof personalInfoFormSchema>>({
        resolver: zodResolver(personalInfoFormSchema),
        defaultValues: defaultValuesPersonalInfo,
    });

    const watchFields = personalInfoForm.watch();
    const hasChanged = Object.keys(defaultValuesPersonalInfo).some(
        (key) =>
            watchFields[key as keyof typeof defaultValuesPersonalInfo] !==
            defaultValuesPersonalInfo[key as keyof typeof defaultValuesPersonalInfo]
    );

    function personalInfoOnSubmit(data: z.infer<typeof personalInfoFormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    }

    return (
        <div className="grid lg:grid-cols-7 lg:grid-rows-none grid-rows-3 h-fit ">
            <div className="lg:col-span-3 row-span-1 bg-[#EBEBF3] rounded-s-sm">
                <div className="mx-10 my-8 lg:space-y-4">
                    <div className="text-2xl font-semibold xl:whitespace-nowrap">Personal Information</div>
                    <div className="text-sm">
                        This information is public and will be shared with other users.
                    </div>
                </div>
            </div>
            <div className="lg:col-span-4  row-span-2 lg:row-span-1 bg-white relative rounded-e-sm">
                <Form {...personalInfoForm}>
                    <form
                        onSubmit={personalInfoForm.handleSubmit(personalInfoOnSubmit)}
                        className="space-y-4 m-8"
                    >
                        {/* <DialogUpdateAvatar /> */}

                        <div className="flex-1 space-y-4">
                            <FormField
                                control={personalInfoForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter your email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={personalInfoForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter your name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-2 !mt-10">
                                {hasChanged && (
                                    <Button
                                        type="button"
                                        className="col-span-1"
                                        variant="cancel"
                                        size="account"
                                        onClick={() => personalInfoForm.reset(defaultValuesPersonalInfo)}
                                    >
                                        CANCEL
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    className={`col-span-1 font-semibold  col-start-2 ${
                                        !hasChanged
                                            ? "text-gray-300  border-gray-300 pointer-events-none"
                                            : ""
                                    }`}
                                    size="account"
                                    variant={hasChanged ? "default" : "outline"}
                                >
                                    SAVE CHANGES
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
