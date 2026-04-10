"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error("Error occurred:", error);
  }, [error]);

  return (
    <div className="flex flex-col gap-4 flex-1 items-center justify-center">
      <h2 className="text-destructive text-4xl">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button asChild>
        <Link href="/">Go back to Home</Link>
      </Button>
    </div>
  );
}
