"use client";

import { useActionState, useEffect, useState } from "react";

import type { Application } from "@/lib/generated/prisma/browser";
import { updateApplicationAction } from "@/actions";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import ApplicationFields, {
  type ApplicationFormValues,
} from "./application-fields";

interface EditApplicationFormProps {
  application: Application;
  onSuccess: () => void;
  onCancel: () => void;
}

const initialState = {
  success: false,
  errors: null,
};

function getApplicationValues(application: Application): ApplicationFormValues {
  return {
    companyName: application.companyName,
    role: application.role,
    location: application.location ?? "",
    workMode: application.workMode ?? "",
    status: application.status,
    dateApplied: application.dateApplied.toISOString().split("T")[0],
    link: application.link ?? "",
    roleDescription: application.roleDescription ?? "",
  };
}

export default function EditApplicationForm({
  application,
  onSuccess,
  onCancel,
}: EditApplicationFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateApplicationAction,
    initialState,
  );

  const [values, setValues] = useState<ApplicationFormValues>(() =>
    getApplicationValues(application),
  );

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={application.id} />

      <ApplicationFields values={values} onChange={setValues} />

      {state.errors &&
        "message" in state.errors &&
        typeof state.errors.message === "string" && (
          <p className="text-sm text-destructive">{state.errors.message}</p>
        )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
