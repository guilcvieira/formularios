import React from "react";
import { Button } from "./ui/button";
import { MdOutlinePublish } from "react-icons/md";

export default function PublishFormBtn() {
  return (
    <Button className="gap-2" variant="default">
      <MdOutlinePublish className="h-6 w-6" />
      Publish Form
    </Button>
  );
}
