"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/home");
  }, []);

  return (
    <div>
      <p>Welcome to Ence 🚀 </p>
    </div>
  );
}
