"use client";

import { useActionState } from "react";
import * as action from "@/actions";

export default function UpdateApplicationForm() {
  const [state, formAction] = useActionState(action.updateApplicationAction, {
    success: false,
    errors: null,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="id" defaultValue="cmtyphuee0000rwvnzmwbrypy" />

      <input name="companyName" defaultValue="Test Co" />
      <input name="role" defaultValue="Frontend Dev" />
      <input name="link" defaultValue="https://example.com" />
      <select name="status" defaultValue="INTERVIEW">
        <option value="APPLIED">Applied</option>
        <option value="REJECTED">Rejected</option>
        <option value="INTERVIEW">Interview</option>
      </select>

      <button type="submit">Update Application</button>

      {state.success && <p>Updated!</p>}
      {state.errors && (
        <p>Something went wrong: {JSON.stringify(state.errors)}</p>
      )}
    </form>
  );
}
