import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};

type GoogleProfile = {
  email?: string;
  email_verified?: boolean;
};

async function getVerifiedGitHubEmail(
  accessToken: string,
): Promise<string | null> {
  try {
    const response = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const emails = (await response.json()) as GitHubEmail[];

    const verifiedEmail = emails.find((item) => item.primary && item.verified);

    return verifiedEmail?.email.toLowerCase() ?? null;
  } catch {
    return null;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),

  session: {
    strategy: "database",
  },

  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),

    GitHub({
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },

      allowDangerousEmailAccountLinking: true,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !user.email) {
        return false;
      }

      const email = user.email.toLowerCase();

      /*
       * GitHub may return a private or unverified email in the
       * profile response, so we explicitly request the user's
       * email list and require their primary email to be verified.
       */
      if (account.provider === "github") {
        if (!account.access_token) {
          return false;
        }

        const verifiedEmail = await getVerifiedGitHubEmail(
          account.access_token,
        );

        if (!verifiedEmail || verifiedEmail !== email) {
          return false;
        }

        return true;
      }

      /*
       * Google provides an email_verified claim.
       * Only allow authentication when Google confirms ownership
       * of the email address returned in the profile.
       */
      if (account.provider === "google") {
        const googleProfile = profile as GoogleProfile;

        if (!googleProfile.email_verified) {
          return false;
        }

        if (googleProfile.email?.toLowerCase() !== email) {
          return false;
        }

        return true;
      }

      return false;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
});
