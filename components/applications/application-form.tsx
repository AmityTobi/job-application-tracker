"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { FileText, LoaderCircle, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { createApplicationAction } from "@/actions";
import type { CreateApplicationState } from "@/actions/create-application";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  MAX_CV_SIZE,
  formatFileSize,
  validateCvFile,
} from "@/lib/applications/cv";

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

const initialState: CreateApplicationState = {
  success: false,
  applicationId: null,
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

function getErrorMessage(errors: unknown) {
  if (
    typeof errors === "object" &&
    errors !== null &&
    "message" in errors &&
    typeof errors.message === "string"
  ) {
    return errors.message;
  }

  return null;
}

export default function ApplicationForm({ onSuccess }: ApplicationFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    createApplicationAction,
    initialState,
  );

  const [values, setValues] = useState<ApplicationFormValues>(getInitialValues);

  const [clientErrors, setClientErrors] = useState<ApplicationFieldErrors>({});

  const [cvFile, setCvFile] = useState<File | null>(null);

  const [cvError, setCvError] = useState<string | null>(null);

  const [isUploadingCv, setIsUploadingCv] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /*
   * Remember the last Server Action response that was handled.
   * This prevents the success/error side effects from running
   * more than once for the same response.
   */
  const handledState = useRef(state);

  const serverErrors = getServerFieldErrors(state.errors);

  const errors = {
    ...serverErrors,
    ...clientErrors,
  };

  const isBusy = isPending || isUploadingCv;

  useEffect(() => {
    /*
     * Ignore the initial action state and any state that has
     * already been handled.
     */
    if (handledState.current === state) {
      return;
    }

    handledState.current = state;

    /*
     * Handle a failed application creation.
     */
    if (!state.success) {
      const errorMessage = getErrorMessage(state.errors);

      if (errorMessage) {
        toast.error("Something went wrong", {
          description: errorMessage,
        });
      }

      return;
    }

    /*
     * A successful Server Action should always return the ID of
     * the application that was just created.
     */
    if (!state.applicationId) {
      return;
    }

    /*
     * No CV was selected, so application creation is already
     * complete.
     */
    if (!cvFile) {
      onSuccess?.();

      toast.success("Application created", {
        description: "Your application has been added successfully.",
      });

      router.refresh();

      return;
    }

    /*
     * The application now exists and has an ID, so the selected
     * CV can safely be uploaded through the existing protected
     * CV endpoint.
     *
     * The async work lives inside the effect instead of calling
     * component functions from the effect. This keeps the React
     * dependencies explicit and satisfies the hooks lint rules.
     */
    const applicationId = state.applicationId;
    const selectedCv = cvFile;

    let cancelled = false;

    async function uploadSelectedCv() {
      setIsUploadingCv(true);

      try {
        const formData = new FormData();

        formData.set("cv", selectedCv);

        const response = await fetch(`/api/applications/${applicationId}/cv`, {
          method: "POST",
          body: formData,
        });

        const result = (await response.json()) as {
          success?: boolean;
          error?: string;
        };

        if (!response.ok || !result.success) {
          throw new Error(result.error ?? "Could not upload the CV.");
        }

        if (cancelled) {
          return;
        }

        onSuccess?.();

        toast.success("Application created", {
          description: "Your application and CV have been added successfully.",
        });

        router.refresh();
      } catch (error) {
        if (cancelled) {
          return;
        }

        /*
         * The application already exists, so don't report the
         * whole operation as failed. Doing so could encourage a
         * second submission and create a duplicate application.
         */
        onSuccess?.();

        toast.warning("Application created without CV", {
          description:
            error instanceof Error
              ? `${error.message} You can attach the CV from Edit.`
              : "The CV could not be uploaded. You can attach it from Edit.",
        });

        router.refresh();
      } finally {
        if (!cancelled) {
          setIsUploadingCv(false);
        }
      }
    }

    void uploadSelectedCv();

    /*
     * Prevent the asynchronous upload from updating this form
     * after the component has been unmounted.
     */
    return () => {
      cancelled = true;
    };
  }, [state, cvFile, onSuccess, router]);

  function clearFieldError(field: keyof ApplicationFormValues) {
    setClientErrors((previous) => {
      const next = { ...previous };

      delete next[field];

      return next;
    });
  }

  function handleCvChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateCvFile(file);

    if (validationError) {
      setCvFile(null);
      setCvError(validationError);

      toast.error("Invalid CV", {
        description: validationError,
      });

      event.target.value = "";

      return;
    }

    setCvFile(file);
    setCvError(null);
  }

  function handleRemoveCv() {
    setCvFile(null);
    setCvError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const validationErrors = validateApplicationForm(values);

    setClientErrors(validationErrors);

    /*
     * Validate the selected CV again immediately before
     * submission. The protected API route performs its own
     * validation again before anything is stored.
     */
    const selectedCv = fileInputRef.current?.files?.[0];

    const selectedCvError = selectedCv ? validateCvFile(selectedCv) : null;

    setCvError(selectedCvError);

    if (Object.keys(validationErrors).length > 0 || selectedCvError) {
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

      {/* Optional CV */}
      <section
        aria-labelledby="new-application-cv"
        className="space-y-3 rounded-xl border bg-muted/20 p-4"
      >
        <div>
          <h3 id="new-application-cv" className="text-sm font-medium">
            CV used for this application
          </h3>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Optionally attach the PDF CV you used when applying. Maximum file
            size: {formatFileSize(MAX_CV_SIZE)}.
          </p>
        </div>

        {cvFile ? (
          <div className="flex min-w-0 items-center gap-3 rounded-lg border bg-background p-3">
            <div
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
            >
              <FileText className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" title={cvFile.name}>
                {cvFile.name}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatFileSize(cvFile.size)}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isBusy}
              onClick={handleRemoveCv}
              aria-label={`Remove ${cvFile.name}`}
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => fileInputRef.current?.click()}
            className="
              flex w-full items-center justify-center gap-2
              rounded-lg border border-dashed p-5
              text-sm font-medium
              transition-colors
              hover:bg-muted/50
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <Upload aria-hidden="true" className="size-4" />
            Attach PDF CV
          </button>
        )}

        <Label htmlFor="new-application-cv-file" className="sr-only">
          Choose PDF CV
        </Label>

        <input
          ref={fileInputRef}
          id="new-application-cv-file"
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          disabled={isBusy}
          onChange={handleCvChange}
        />

        {cvError && (
          <p role="alert" className="text-sm text-destructive">
            {cvError}
          </p>
        )}
      </section>

      <DialogFooter>
        <DialogClose
          render={<Button type="button" variant="outline" disabled={isBusy} />}
        >
          Cancel
        </DialogClose>

        <Button
          type="submit"
          disabled={isBusy}
          aria-busy={isBusy}
          className="min-w-36 gap-2"
        >
          {isBusy && (
            <LoaderCircle
              className="size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
          )}

          {isBusy ? "Adding..." : "Add application"}
        </Button>
      </DialogFooter>
    </form>
  );
}
