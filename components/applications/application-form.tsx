"use client";

import { useActionState, useEffect, useState } from "react";

import { createApplicationAction } from "@/actions";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

import ApplicationFields, {
  type ApplicationFormValues,
} from "./application-fields";

interface ApplicationFormProps {
  onSuccess?: () => void;
}

const initialState = {
  success: false,
  errors: null,
};

function getInitialValues(): ApplicationFormValues {
  return {
    companyName: "",
    role: "",
    location: "",
    workMode: "",
    status: "APPLIED",
    dateApplied: new Date().toISOString().split("T")[0],
    link: "",
    roleDescription: "",
  };
}

export default function ApplicationForm({ onSuccess }: ApplicationFormProps) {
  const [state, formAction, isPending] = useActionState(
    createApplicationAction,
    initialState,
  );

  const [values, setValues] = useState<ApplicationFormValues>(getInitialValues);

  useEffect(() => {
    if (state.success) {
      setValues(getInitialValues());
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-5">
      <ApplicationFields values={values} onChange={setValues} />

      {state.errors &&
        "message" in state.errors &&
        typeof state.errors.message === "string" && (
          <p className="text-sm text-destructive">{state.errors.message}</p>
        )}

      <DialogFooter>
        <DialogClose
          render={
            <Button type="button" variant="outline" disabled={isPending} />
          }
        >
          Cancel
        </DialogClose>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add application"}
        </Button>
      </DialogFooter>
    </form>
  );
}
