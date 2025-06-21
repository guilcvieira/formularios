import React from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";

export default function SaveFormBtn() {
  return (
    <Button className="gap-2" variant="outline">
      <HiSaveAs className="h-6 w-6" />
      Save Form
    </Button>
  )
}
