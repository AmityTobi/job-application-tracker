"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import type { Application } from "@/lib/generated/prisma/browser";

import { updateApplicationAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import {
  getServerFieldErrors,
  validateApplicationForm,
} from "@/lib/applications/form-validation";

import ApplicationFields, {
  type ApplicationFieldErrors,
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
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    updateApplicationAction,
    initialState,
  );

  const [values, setValues] = useState<ApplicationFormValues>(() =>
    getApplicationValues(application),
  );

  const [clientErrors, setClientErrors] = useState<ApplicationFieldErrors>({});

  const handledState = useRef(state);

  const serverErrors = getServerFieldErrors(state.errors);

  const errors = {
    ...serverErrors,
    ...clientErrors,
  };

  useEffect(() => {
    if (handledState.current === state) {
      return;
    }

    handledState.current = state;

    if (state.success) {
      toast.success("Application updated", {
        description: "Your changes have been saved successfully.",
      });

      onSuccess();

      router.refresh();

      return;
    }

    if (
      state.errors &&
      "message" in state.errors &&
      typeof state.errors.message === "string"
    ) {
      toast.error("Something went wrong", {
        description: state.errors.message,
      });
    }
  }, [state, onSuccess, router]);

  function clearFieldError(field: keyof ApplicationFormValues) {
    setClientErrors((previous) => {
      const next = { ...previous };

      delete next[field];

      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const validationErrors = validateApplicationForm(values);

    setClientErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      event.preventDefault();

      toast.error("Validation failed", {
        description: "Please correct the highlighted fields.",
      });
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      <input type="hidden" name="id" value={application.id} />

      <ApplicationFields
        values={values}
        onChange={setValues}
        errors={errors}
        onClearError={clearFieldError}
      />

      {state.errors &&
        "message" in state.errors &&
        typeof state.errors.message === "string" && (
          <p role="alert" className="text-sm text-destructive">
            {state.errors.message}
          </p>
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

        <Button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="min-w-36 gap-2"
        >
          {isPending && (
            <LoaderCircle
              className="size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
          )}

          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
