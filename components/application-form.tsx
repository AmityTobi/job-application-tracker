"use client";

import { useActionState } from "react";
import * as action from "@/actions";

export default function ApplicationForm() {
  const [state, formAction] = useActionState(action.createApplicationAction, {
    success: false,
    errors: null,
  });

  return (
    <div>
      <form action={formAction}>
        <input name="companyName" defaultValue="Test Co" />
        <input name="role" defaultValue="Frontend Dev" />
        <textarea
          name="roleDescription"
          defaultValue="Frontend Dev with 3 years experience"
        />
        <input name="link" defaultValue="https://example.com" />
        <select name="status" defaultValue="APPLIED">
          <option value="APPLIED">Applied</option>
          <option value="REJECTED">Rejected</option>
          <option value="INTERVIEW">Interview</option>
        </select>
        <button type="submit" className="rounded rounded-2xl bg-blue-950">
          Create Application
        </button>
      </form>

      {state.success && <p>Created!</p>}
      {state.errors && (
        <p>Something went wrong: {JSON.stringify(state.errors)}</p>
      )}
    </div>
  );
}
