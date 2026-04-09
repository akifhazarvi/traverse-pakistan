import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-24 sm:py-32">
      <Container>
        <div className="text-center max-w-md mx-auto">
          <span className="text-6xl">🏔️</span>
          <h1 className="text-[32px] font-bold text-[var(--text-primary)] mt-6">
            Page Not Found
          </h1>
          <p className="text-lg text-[var(--text-tertiary)] mt-3">
            Looks like this trail doesn&apos;t exist. Let&apos;s get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/">
              <Button size="lg">Back to Home</Button>
            </Link>
            <Link href="/tours">
              <Button variant="outline" size="lg">Browse Tours</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
