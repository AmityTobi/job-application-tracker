export type AuthErrorMessage = {
  title: string;
  description: string;
  suggestion?: string;
};

const authErrors: Record<string, AuthErrorMessage> = {
  OAuthAccountNotLinked: {
    title: "Account already exists",
    description:
      "An account already exists with this email address, but your chosen sign-in method isn't connected.",
    suggestion:
      "Sign in using your original provider. Your existing applications are safe.",
  },

  EmailVerificationFailed: {
    title: "Email verification failed",
    description:
      "We couldn't confirm that your sign-in provider has verified your email address.",
    suggestion: "Verify your email with your provider and try again.",
  },

  AdditionalVerificationRequired: {
    title: "Additional verification required",
    description:
      "This email address is already associated with another JobTrack account.",
    suggestion:
      "Sign in using your original provider. We can't automatically connect these accounts yet.",
  },

  AccessDenied: {
    title: "Unable to sign in",
    description:
      "We couldn't complete authentication with your selected provider.",
    suggestion: "Check that your email is verified, then try again.",
  },

  OAuthCallbackError: {
    title: "Authentication interrupted",
    description:
      "We couldn't complete authentication with your selected provider.",
    suggestion: "Please try again or choose another sign-in method.",
  },

  OAuthCallback: {
    title: "Authentication interrupted",
    description: "Something went wrong while completing authentication.",
    suggestion: "Please try signing in again.",
  },

  OAuthSignin: {
    title: "Connection failed",
    description: "We couldn't connect to your authentication provider.",
    suggestion: "Please try again shortly.",
  },

  OAuthSignInError: {
    title: "Connection failed",
    description:
      "We couldn't start authentication with your selected provider.",
    suggestion: "Please try again shortly.",
  },

  Configuration: {
    title: "Authentication unavailable",
    description: "Our authentication service is temporarily unavailable.",
    suggestion: "Please try again later.",
  },
};

export function getAuthError(error?: string): AuthErrorMessage | null {
  if (!error) {
    return null;
  }

  return (
    authErrors[error] ?? {
      title: "Something went wrong",
      description: "We couldn't complete your sign-in request.",
      suggestion:
        "Please try again. If the problem continues, contact support.",
    }
  );
}
