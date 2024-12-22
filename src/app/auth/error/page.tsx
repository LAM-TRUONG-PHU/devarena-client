// pages/auth/error.tsx
"use client"
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Error occurred</h1>
      <p>{"An unexpected error occurred."}</p>
    </div>
  );
}
