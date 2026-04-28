import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Traverse Pakistan account to manage your bookings.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <div className="max-w-[420px] mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight">
              Create account
            </h1>
            <p className="text-[14px] text-[var(--text-secondary)] mt-2">
              Join Traverse Pakistan to manage your bookings and wishlist.
            </p>
          </div>
          <SignInForm defaultMode="sign-up" />
        </div>
      </Container>
    </div>
  );
}
