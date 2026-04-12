import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Cancellation Policy | Traverse Pakistan",
  description:
    "Understand Traverse Pakistan's cancellation and refund policy for group tours, custom tours, transport, hotels, and airline tickets.",
};

export default function CancellationPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Cancellation Policy" }]} />

        <div className="mt-8 max-w-3xl">
          <h1 className="text-[32px] sm:text-[42px] font-bold text-[var(--text-primary)] tracking-tight">
            Cancellation Policy
          </h1>
          <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
            We understand that plans can change. Below are our cancellation charges based on how far
            in advance you cancel. All cancellations must be submitted in writing to our team.
          </p>
        </div>

        <div className="mt-12 space-y-10 max-w-3xl">

          {/* Group Tours */}
          <section>
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-4">
              Group / Public Tours
            </h2>
            <div className="bg-[var(--bg-subtle)] rounded-xl overflow-hidden">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[var(--border-default)]">
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Cancellation Notice</th>
                    <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">Charges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {[
                    { days: "14 days before departure", charge: "50%" },
                    { days: "7 days before departure", charge: "75%" },
                    { days: "3 days before departure", charge: "100%" },
                    { days: "1 day before departure", charge: "100%" },
                  ].map(({ days, charge }) => (
                    <tr key={days}>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)]">{days}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-[var(--text-primary)]">{charge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Custom Tours */}
          <section>
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-4">
              Custom / Private Tours
            </h2>
            <div className="bg-[var(--bg-subtle)] rounded-xl overflow-hidden">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[var(--border-default)]">
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Cancellation Notice</th>
                    <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">Charges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {[
                    { days: "30 days before departure", charge: "75%" },
                    { days: "7 days before departure", charge: "100%" },
                    { days: "3 days before departure", charge: "100%" },
                  ].map(({ days, charge }) => (
                    <tr key={days}>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)]">{days}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-[var(--text-primary)]">{charge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Transport */}
          <section>
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-4">
              Transport Service
            </h2>
            <div className="bg-[var(--bg-subtle)] rounded-xl overflow-hidden">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[var(--border-default)]">
                    <th className="text-left px-5 py-3 font-semibold text-[var(--text-secondary)]">Cancellation Notice</th>
                    <th className="text-right px-5 py-3 font-semibold text-[var(--text-secondary)]">Charges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {[
                    { days: "14 days before departure", charge: "30%" },
                    { days: "7 days before departure", charge: "50%" },
                    { days: "3 days before departure", charge: "75%" },
                    { days: "1 day before departure", charge: "100%" },
                  ].map(({ days, charge }) => (
                    <tr key={days}>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)]">{days}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-[var(--text-primary)]">{charge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Hotels & Airlines */}
          <section>
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-4">
              Hotels &amp; Airline Tickets
            </h2>
            <div className="bg-[var(--bg-subtle)] rounded-xl p-6">
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Cancellation policies vary per hotel or airline and will be clearly communicated
                before booking confirmation.
              </p>
            </div>
          </section>

          {/* Flight / Road Closure */}
          <section>
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-4">
              Flight Cancellation / Road Closure
            </h2>
            <div className="p-5 border border-[var(--border-default)] rounded-xl">
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                In the event of a flight cancellation or road closure, clients may choose to
                reschedule their trip within <strong className="text-[var(--text-primary)]">6 months</strong> or cancel.
                A minimum cancellation charge of <strong className="text-[var(--text-primary)]">50%</strong> applies in either case.
              </p>
            </div>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-4">
              Refund Policy
            </h2>
            <div className="bg-[var(--bg-subtle)] rounded-xl p-6">
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Approved refunds are processed within{" "}
                <strong className="text-[var(--text-primary)]">6 working weeks</strong> from the
                date of cancellation.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[var(--bg-dark)] rounded-2xl p-8 text-[var(--on-dark)]">
            <h2 className="text-[20px] font-bold mb-2">Need to cancel or reschedule?</h2>
            <p className="text-[var(--on-dark-secondary)] text-[14px] mb-5">
              Contact our team as early as possible — we&apos;ll do our best to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/923216650670"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1fb855] text-white text-[14px] font-semibold rounded-full transition-colors"
              >
                WhatsApp Us
              </a>
              <a
                href="mailto:info@traversepakistan.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--on-dark-glass)] hover:bg-[var(--on-dark-glass-hover)] text-[var(--on-dark)] text-[14px] font-semibold rounded-full transition-colors"
              >
                info@traversepakistan.com
              </a>
            </div>
          </section>

        </div>
      </Container>
    </div>
  );
}
