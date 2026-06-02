import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, LegalLayout } from "@/components/marketing/marketing-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Ryport" },
      { name: "description", content: "How Ryport collects, uses, and protects your information." },
      { property: "og:title", content: "Privacy Policy — Ryport" },
      { property: "og:description", content: "How Ryport collects, uses, and protects your information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <MarketingShell>
      <LegalLayout title="Privacy Policy" updated="May 20, 2026">
        <p>
          Ryport ("we", "us", "our") provides AI-powered financial tools for small businesses. This Privacy Policy explains
          what information we collect, how we use it, and the choices you have. We designed Ryport to collect as little data
          as possible while still delivering an excellent product.
        </p>

        <h2>1. Information we collect</h2>
        <p>We collect three categories of information:</p>
        <ul>
          <li><strong>Account information</strong> — name, email address, business name, and authentication credentials.</li>
          <li><strong>Financial information</strong> — transactions, categories, and notes you add or import into Ryport.</li>
          <li><strong>Product usage</strong> — basic, aggregated analytics about how you use Ryport, used only to improve the product.</li>
        </ul>

        <h2>2. How we use your data</h2>
        <ul>
          <li>To operate, secure, and improve Ryport.</li>
          <li>To generate AI-powered insights, summaries, and recommendations.</li>
          <li>To communicate important account, security, and product updates.</li>
          <li>To comply with legal and regulatory obligations.</li>
        </ul>
        <p>We do not sell your personal or financial data. Ever.</p>

        <h2>3. Cookies & analytics</h2>
        <p>We use a small number of essential cookies to keep you signed in and to remember your preferences. We use privacy-respecting product analytics to understand which features are useful. See our Cookie Policy for details.</p>

        <h2>4. Account security</h2>
        <p>All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Access to production systems is limited, logged, and reviewed. We follow the principle of least privilege across our team and infrastructure.</p>

        <h2>5. Your rights</h2>
        <p>You can, at any time:</p>
        <ul>
          <li>Access or export your data from your account settings.</li>
          <li>Correct inaccurate information.</li>
          <li>Delete your account and the data associated with it.</li>
          <li>Object to or restrict certain processing where applicable by law.</li>
        </ul>

        <h2>6. Data retention</h2>
        <p>We retain your data for as long as your account is active. When you delete your account, we delete your data within 30 days, except where retention is required by law (for example, tax or audit obligations).</p>

        <h2>7. Third-party services</h2>
        <p>We use a limited set of vetted infrastructure providers (hosting, authentication, AI inference, analytics). Each provider is bound by a Data Processing Agreement and contractually required to protect your data.</p>

        <h2>8. International transfers</h2>
        <p>Ryport operates globally. Where data is transferred internationally, we rely on appropriate safeguards such as Standard Contractual Clauses.</p>

        <h2>9. Changes to this policy</h2>
        <p>We may update this policy from time to time. Material changes will be communicated by email or in-app notice at least 14 days before they take effect.</p>

        <h2>10. Contact</h2>
        <p>For privacy questions or data requests, contact us at <a href="mailto:privacy@ryport.com">privacy@ryport.com</a>.</p>
      </LegalLayout>
    </MarketingShell>
  );
}