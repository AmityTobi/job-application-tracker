import { describe, expect, it } from "vitest";

import {
  MAX_CV_SIZE,
  createContentDisposition,
  createCvPathname,
  formatFileSize,
  hasPdfSignature,
  validateCvFile,
} from "@/lib/applications/cv";

describe("CV utilities", () => {
  describe("formatFileSize", () => {
    it("formats bytes", () => {
      expect(formatFileSize(500)).toBe("500 B");
    });

    it("formats kilobytes", () => {
      expect(formatFileSize(1024)).toBe("1.0 KB");
    });

    it("formats megabytes", () => {
      expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
    });
  });

  describe("validateCvFile", () => {
    it("accepts a valid PDF", () => {
      const file = new File(["%PDF-1.7"], "frontend-cv.pdf", {
        type: "application/pdf",
      });

      expect(validateCvFile(file)).toBeNull();
    });

    it("rejects a non-PDF extension", () => {
      const file = new File(["image"], "frontend-cv.jpg", {
        type: "image/jpeg",
      });

      expect(validateCvFile(file)).toBe("CV must be a PDF file.");
    });

    it("rejects an empty PDF", () => {
      const file = new File([], "frontend-cv.pdf", {
        type: "application/pdf",
      });

      expect(validateCvFile(file)).toBe("The selected PDF is empty.");
    });

    it("rejects a PDF larger than 5 MB", () => {
      const file = new File(
        [new Uint8Array(MAX_CV_SIZE + 1)],
        "frontend-cv.pdf",
        {
          type: "application/pdf",
        },
      );

      expect(validateCvFile(file)).toBe("CV must be 5 MB or smaller.");
    });
  });

  describe("hasPdfSignature", () => {
    it("accepts a file with a PDF signature", async () => {
      const file = new File(["%PDF-1.7 test document"], "frontend-cv.pdf", {
        type: "application/pdf",
      });

      await expect(hasPdfSignature(file)).resolves.toBe(true);
    });

    it("rejects a file without a PDF signature", async () => {
      const file = new File(["This is not really a PDF"], "fake.pdf", {
        type: "application/pdf",
      });

      await expect(hasPdfSignature(file)).resolves.toBe(false);
    });
  });

  describe("createCvPathname", () => {
    it("creates an application-specific PDF pathname", () => {
      const pathname = createCvPathname({
        userId: "user-123",
        applicationId: "application-456",
      });

      expect(pathname).toMatch(
        /^applications\/user-123\/application-456\/.+\.pdf$/,
      );
    });

    it("creates a unique pathname each time", () => {
      const firstPathname = createCvPathname({
        userId: "user-123",
        applicationId: "application-456",
      });

      const secondPathname = createCvPathname({
        userId: "user-123",
        applicationId: "application-456",
      });

      expect(firstPathname).not.toBe(secondPathname);
    });
  });

  describe("createContentDisposition", () => {
    it("creates an inline disposition for viewing", () => {
      const disposition = createContentDisposition("frontend-cv.pdf", false);

      expect(disposition).toContain("inline;");
      expect(disposition).toContain('filename="frontend-cv.pdf"');
    });

    it("creates an attachment disposition for downloading", () => {
      const disposition = createContentDisposition("frontend-cv.pdf", true);

      expect(disposition).toContain("attachment;");
      expect(disposition).toContain('filename="frontend-cv.pdf"');
    });
  });
});
