import { GetFormById } from "@actions/form";
import FormBuilder from "@/components/FormBuilder";
import React from "react";

async function BuilderPage({ params }: { params: { formId: string } }) {
  const { formId } = await params;
  const form = await GetFormById(Number(formId));

  if (!form) {
    throw new Error("Form not found");
  }

  return <FormBuilder form={form} />;
}

export default BuilderPage;
