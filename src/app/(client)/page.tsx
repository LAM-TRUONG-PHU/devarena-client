"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const route =useRouter()
  useEffect(()=>{
    route.push("/study")
  },[])
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     
    </div>
  );
}
