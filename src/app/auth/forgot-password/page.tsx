import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your Traverse Pakistan account password.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <div className="max-w-[420px] mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight">
              Forgot password?
            </h1>
            <p className="text-[14px] text-[var(--text-secondary)] mt-2">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </Container>
    </div>
  );
}
