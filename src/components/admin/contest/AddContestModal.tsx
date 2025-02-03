"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import CustomEditor from "@/components/CustomEditor/CustomEditor"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { createContest } from "@/redux/slices/admin/ContestSlice"
import { usePrivate } from "@/hooks/usePrivateAxios"
import { Spinner } from "@/components/ui/spinner"

interface AddContestButtonProps {   
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export default function AddContestModal({ isOpen, setIsOpen }: AddContestButtonProps) {
  const [formData, setFormData] = useState({
    coverImage: null as File | null,
    contestName: "",
    description: "",
    startDate: "",
    endDate: "",
  })
  const axiosInstance = usePrivate()
  const dispatch = useAppDispatch();  
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };
   const {loadingAction} = useAppSelector((state) => state.contest);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement
    if (name === "coverImage" && files && files[0]) {
      const file = files[0]
      setFormData((prev) => ({ ...prev, [name]: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // console.log("Form submitted:", formData)
    dispatch(createContest({
      axiosInstance:axiosInstance,
      contestName:formData.contestName,
      description:formData.description,
      startDate:formData.startDate,
      endDate:formData.endDate,
      coverImage:formData.coverImage,
    })).unwrap().then(()=>{
      setIsOpen(false)
    })
    // Here you would typically send this data to your backend
   
    // setIsOpen(false)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }


  return (
    
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Contest</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add New Contest</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image</Label>
                <div className="flex flex-col items-center">
                  {imagePreview ? (
                    <div className="relative w-full h-40 mb-2">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Cover preview"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2">
                      <span className="text-gray-500">No image selected</span>
                    </div>
                  )}
                  <Input
                    id="coverImage"
                    name="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <Button type="button" onClick={triggerFileInput}>
                    {imagePreview ? "Change Image" : "Select Image"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contestName">Contest Name</Label>
                <Input
                  id="contestName"
                  name="contestName"
                  value={formData.contestName}
                  onChange={handleInputChange}
                  placeholder="Programming Contest 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="description">Description</Label>
              {/* <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the contest..."
                className="h-full min-h-[200px]"
              /> */}
              <CustomEditor
                content={formData.description}
                onValueChange={handleEditorChange}

              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loadingAction}>
            {loadingAction ? <Spinner show={loadingAction} size="small" /> : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

