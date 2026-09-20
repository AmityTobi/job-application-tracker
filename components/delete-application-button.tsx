"use client";

import { useActionState } from "react";

import { deleteApplicationAction } from "@/actions";
import { DeleteApplicationState } from "@/actions/delete-application";

interface DeleteApplicationButtonProps {
  id: string;
}

const initialState: DeleteApplicationState = {
  success: false,
  errors: null,
};

export default function DeleteApplicationButton({
  id,
}: DeleteApplicationButtonProps) {
  const [state, formAction, isPending] = useActionState(
    deleteApplicationAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />

      <button type="submit" disabled={isPending}>
        {isPending ? "Deleting..." : "Delete"}
      </button>

      {state.errors && <p>{state.errors.message}</p>}
    </form>
  );
}
