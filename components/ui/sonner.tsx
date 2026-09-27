"use client";

import { useTheme } from "next-themes";

import { Toaster as Sonner, type ToasterProps } from "sonner";

import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-500" />,

        info: <InfoIcon className="size-5 text-blue-500" />,

        warning: <TriangleAlertIcon className="size-5 text-amber-500" />,

        error: <OctagonXIcon className="size-5 text-red-500" />,

        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border !border-border !bg-popover !text-popover-foreground !shadow-lg",

          title: "!text-sm !font-semibold",

          description: "!text-sm !text-muted-foreground",

          icon: "!mr-2",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
