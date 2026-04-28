import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set new password",
  description: "Choose a new password for your Traverse Pakistan account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <div className="max-w-[420px] mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight">
              Set new password
            </h1>
            <p className="text-[14px] text-[var(--text-secondary)] mt-2">
              Choose a strong password for your account.
            </p>
          </div>
          <ResetPasswordForm />
        </div>
      </Container>
    </div>
  );
}
