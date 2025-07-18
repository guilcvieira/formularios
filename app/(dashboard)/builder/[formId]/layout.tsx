import React from "react";

export default function layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-1">{children}</div>
  );
}
