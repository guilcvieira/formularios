import React from "react";
import { ImSpinner2 } from "react-icons/im";

export default function LoadingPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <ImSpinner2 className="animate-spin" />
    </div>
  );
}
