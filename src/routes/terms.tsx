import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, LegalLayout } from "@/components/marketing/marketing-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Zentriq" },
      { name: "description", content: "The terms that govern your use of Zentriq." },
      { property: "og:title", content: "Terms of Service — Zentriq" },
      { property: "og:description", content: "The terms that govern your use of Zentriq." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <MarketingShell>
      <LegalLayout title="Terms of Service" updated="May 20, 2026">
        <p>These Terms of Service ("Terms") govern your access to and use of Zentriq. By creating an account or using the service, you agree to these Terms. Please read them carefully.</p>

        <h2>1. The service</h2>
        <p>Zentriq provides software tools to track income, monitor cashflow, and surface AI-generated financial insights. We continuously improve the product and may add, change, or remove features over time.</p>

        <h2>2. Your account</h2>
        <ul>
          <li>You must provide accurate information when registering.</li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>You must keep your credentials confidential and notify us promptly of any unauthorized access.</li>
          <li>You must be at least 18 years old, or the age of majority in your jurisdiction.</li>
        </ul>

        <h2>3. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use Zentriq for any unlawful, fraudulent, or harmful purpose.</li>
          <li>Attempt to disrupt, reverse-engineer, or circumvent security controls.</li>
          <li>Upload malware, illegal content, or data you do not have the right to share.</li>
          <li>Abuse our AI features by attempting prompt injection, scraping, or rate-limit evasion.</li>
        </ul>

        <h2>4. Subscriptions & billing</h2>
        <p>Zentriq offers a free plan and paid plans. Paid plans are billed in advance on a recurring basis and renew automatically until cancelled. You can cancel at any time from your account; cancellation takes effect at the end of the current billing period.</p>

        <h2>5. Intellectual property</h2>
        <p>Zentriq and its underlying software, design, and trademarks are owned by us. You retain ownership of the financial data you upload. You grant us a limited license to process that data solely to operate the service on your behalf.</p>

        <h2>6. AI-generated content</h2>
        <p>Zentriq uses AI models to produce summaries, suggestions, and forecasts. These outputs are informational and do not constitute financial, tax, or legal advice. You are responsible for verifying any decision you make based on AI output.</p>

        <h2>7. Limitation of liability</h2>
        <p>To the maximum extent permitted by law, Zentriq is provided "as is" without warranties of any kind. We are not liable for indirect, incidental, or consequential damages, and our total liability is limited to the amount you paid us in the prior twelve months.</p>

        <h2>8. Termination</h2>
        <p>You may close your account at any time. We may suspend or terminate accounts that violate these Terms, present a security risk, or remain inactive for an extended period, with reasonable notice where possible.</p>

        <h2>9. Changes</h2>
        <p>We may update these Terms. We'll notify you of material changes at least 14 days before they take effect. Continued use after the effective date constitutes acceptance.</p>

        <h2>10. Governing law</h2>
        <p>These Terms are governed by the laws of the jurisdiction in which Zentriq is incorporated, without regard to conflict-of-laws principles.</p>

        <h2>11. Contact</h2>
        <p>Questions? Reach us at <a href="mailto:legal@zentriq.com">legal@zentriq.com</a>.</p>
      </LegalLayout>
    </MarketingShell>
  );
}