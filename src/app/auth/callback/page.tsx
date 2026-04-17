import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CallbackHandler } from "@/components/auth/CallbackHandler";

export const metadata: Metadata = {
  title: "Signing you in…",
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <div className="max-w-[420px] mx-auto">
          <CallbackHandler />
        </div>
      </Container>
    </div>
  );
}
