"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { createApplicationAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

import {
  getServerFieldErrors,
  validateApplicationForm,
} from "@/lib/applications/form-validation";

import ApplicationFields, {
  type ApplicationFieldErrors,
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
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    createApplicationAction,
    initialState,
  );

  const [values, setValues] = useState<ApplicationFormValues>(getInitialValues);

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
      setValues(getInitialValues());
      setClientErrors({});

      // Close the dialog first.
      onSuccess?.();

      // Then show the success notification.
      toast.success("Application created", {
        description: "Your application has been added successfully.",
      });

      // Refresh server-rendered application data.
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
      <ApplicationFields
        values={values}
        onChange={setValues}
        errors={errors}
        onClearError={clearFieldError}
      />

      <DialogFooter>
        <DialogClose
          render={
            <Button type="button" variant="outline" disabled={isPending} />
          }
        >
          Cancel
        </DialogClose>

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

          {isPending ? "Adding..." : "Add application"}
        </Button>
      </DialogFooter>
    </form>
  );
}
