import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, LegalLayout } from "@/components/marketing/marketing-shell";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Ryport" },
      { name: "description", content: "How Ryport uses cookies and similar technologies." },
      { property: "og:title", content: "Cookie Policy — Ryport" },
      { property: "og:description", content: "How Ryport uses cookies and similar technologies." },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <MarketingShell>
      <LegalLayout title="Cookie Policy" updated="May 20, 2026">
        <p>This Cookie Policy explains how Ryport uses cookies and similar technologies when you visit our website or use our product. We aim to keep this short, clear, and free of legalese.</p>

        <h2>1. What are cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They allow the site to remember your actions and preferences (such as login state) over a period of time.</p>

        <h2>2. How we use cookies</h2>
        <p>We use cookies for three purposes:</p>
        <ul>
          <li><strong>Essential cookies</strong> — required to operate the service, keep you signed in, and protect your account.</li>
          <li><strong>Preference cookies</strong> — remember your theme, currency, and dashboard settings.</li>
          <li><strong>Analytics cookies</strong> — help us understand, in aggregate, which features are useful so we can improve the product.</li>
        </ul>

        <h2>3. Analytics tracking</h2>
        <p>We use privacy-respecting analytics that do not sell or share your data with advertisers. We never use third-party advertising cookies or cross-site tracking.</p>

        <h2>4. Your consent</h2>
        <p>Essential cookies are required for Ryport to function and cannot be disabled. For non-essential cookies, you can opt out at any time from your account settings.</p>

        <h2>5. Managing cookies in your browser</h2>
        <p>Most browsers let you view, manage, or delete cookies. Refer to your browser's documentation (Chrome, Safari, Firefox, Edge) for instructions. Note that disabling essential cookies may prevent parts of Ryport from working correctly.</p>

        <h2>6. Third-party services</h2>
        <p>A small number of trusted infrastructure providers (authentication, hosting) may set their own cookies to deliver their service. Each is bound by a data processing agreement with us.</p>

        <h2>7. Changes to this policy</h2>
        <p>We may update this Cookie Policy as our practices evolve. Material changes will be communicated in-app or by email.</p>

        <h2>8. Contact</h2>
        <p>Questions about cookies? Email us at <a href="mailto:privacy@ryport.com">privacy@ryport.com</a>.</p>
      </LegalLayout>
    </MarketingShell>
  );
}