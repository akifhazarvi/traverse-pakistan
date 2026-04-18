import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Traverse Pakistan collects, uses, stores, and protects your personal information. GDPR-aligned practices for our tour and booking services.",
  path: "/privacy",
});

const sections = [
  {
    heading: "Information We Collect",
    content: [
      "When you book a tour, contact us, or use our website, we may collect the following information:",
      [
        "Full name, email address, and phone number",
        "Departure city and travel preferences",
        "Payment details (processed securely through our payment partners)",
        "Passport or CNIC details where required for trip documentation",
        "Any special requests or medical information relevant to your trip",
      ],
    ],
  },
  {
    heading: "How We Use Your Information",
    content: [
      "We use the information we collect to:",
      [
        "Process and confirm your tour bookings",
        "Send you trip details, itineraries, and important updates",
        "Respond to your inquiries and provide customer support",
        "Improve our website, services, and tour offerings",
        "Send promotional emails about upcoming tours or offers (you may opt out at any time)",
        "Comply with legal obligations where required",
      ],
    ],
  },
  {
    heading: "How We Share Your Information",
    content: [
      "We do not sell or rent your personal information to third parties. We may share your information only in the following limited circumstances:",
      [
        "With hotels, transport providers, and local guides to fulfil your booking",
        "With payment processors to handle transactions securely",
        "With government authorities if required by law",
        "With our trusted service providers who assist in operating our website and business, under strict confidentiality agreements",
      ],
    ],
  },
  {
    heading: "Cookies",
    content: [
      "Our website uses cookies to enhance your browsing experience. Cookies are small files stored on your device that help us:",
      [
        "Remember your preferences and settings",
        "Understand how visitors use our website (via analytics tools)",
        "Improve site performance and content",
      ],
      "You can control or disable cookies through your browser settings. Disabling cookies may affect certain features of our website.",
    ],
  },
  {
    heading: "Data Security",
    content: [
      "We take the security of your personal information seriously. We implement appropriate technical and organisational measures to protect your data against unauthorised access, loss, or misuse. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "Data Retention",
    content: [
      "We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, it is securely deleted.",
    ],
  },
  {
    heading: "Your Rights",
    content: [
      "You have the right to:",
      [
        "Access the personal information we hold about you",
        "Request correction of inaccurate or incomplete data",
        "Request deletion of your data (subject to legal obligations)",
        "Opt out of marketing communications at any time",
        "Withdraw consent where processing is based on consent",
      ],
      "To exercise any of these rights, please contact us at info@traversepakistan.com.",
    ],
  },
  {
    heading: "Third-Party Links",
    content: [
      "Our website may contain links to third-party websites (such as hotel booking platforms or social media). We are not responsible for the privacy practices of those websites and encourage you to review their privacy policies before providing any personal information.",
    ],
  },
  {
    heading: "Children's Privacy",
    content: [
      "Our services are not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us so we can promptly remove it.",
    ],
  },
  {
    heading: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Privacy Policy" }]} />

        <div className="mt-8 max-w-3xl">
          <h1 className="text-[32px] sm:text-[42px] font-bold text-[var(--text-primary)] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
            At Traverse Pakistan, your privacy matters. This policy explains what personal information
            we collect, how we use it, and how we keep it safe. By using our website or booking a
            tour with us, you agree to the practices described below.
          </p>
          <p className="mt-2 text-[13px] text-[var(--text-tertiary)]">
            Effective date: January 1, 2025
          </p>
        </div>

        <div className="mt-12 max-w-3xl space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-3">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.content.map((block, i) =>
                  Array.isArray(block) ? (
                    <ul key={i} className="space-y-2 pl-1">
                      {block.map((item) => (
                        <li key={item} className="flex gap-3 text-[14px] text-[var(--text-secondary)]">
                          <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i} className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                      {block}
                    </p>
                  )
                )}
              </div>
            </section>
          ))}

          {/* Contact */}
          <section className="bg-[var(--bg-dark)] rounded-2xl p-8 text-[var(--on-dark)]">
            <h2 className="text-[20px] font-bold mb-2">Contact Us</h2>
            <p className="text-[var(--on-dark-secondary)] text-[14px] mb-5">
              If you have any questions or concerns about this Privacy Policy, please reach out to us.
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
