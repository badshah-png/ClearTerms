/**
 * sampleDocuments.ts — clearly FICTIONAL sample documents for trying the app.
 *
 * SECURITY NOTE: the card number below is the well-known Luhn-valid *test*
 * number used across the payments industry; the "credentials" are invented.
 * They exist so you can watch automatic redaction work before analysis.
 */
export interface SampleDocument {
  id: string;
  label: string;
  kind: string;
  text: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: "gym",
    label: "Gym membership",
    kind: "Membership agreement",
    text: `FITCORE HEALTH CLUBS — MEMBERSHIP AGREEMENT

This Membership Agreement ("Agreement") is entered into between FitCore Health Clubs LLC ("Club") and the undersigned member ("Member").

1. Membership Fees. Member agrees to pay a monthly membership fee of $49.99, charged to the payment method on file (card on file: 4539 1488 0343 6467, CVV: 123). An annual maintenance fee of $79.00 will be charged each January. All fees are non-refundable.

2. Term and Automatic Renewal. The initial term is twelve (12) months beginning March 1, 2026. This Agreement renews automatically for successive twelve-month terms unless Member provides written notice of cancellation at least 30 days before the renewal date.

3. Early Termination. If Member cancels before the end of the current term, an early termination fee of $175.00 applies, plus any outstanding balance.

4. Late Payments. Payments not received within 10 days of the due date incur a late charge of $15.00 or 1.5% per month, whichever is greater.

5. Disputes. Member agrees that any dispute will be resolved exclusively by binding arbitration, and Member waives any right to participate in a class action.

6. Privacy. The Club may share Member usage data and contact information with third-party partners for marketing purposes.

7. Rules. Member must comply with all Club rules, which the Club may modify from time to time. The Club may suspend membership at its sole discretion without prior notice.

By signing below, Member acknowledges this is a legally binding agreement. Password for online account: WinterSun$2026. Verification code is 482913.`,
  },
  {
    id: "streaming",
    label: "Streaming subscription",
    kind: "Terms of service",
    text: `STREAMLY+ SUBSCRIPTION TERMS (excerpt)

Welcome to Streamly+. These Terms of Service govern your use of the Streamly+ website, apps, and streaming service.

Billing. The Standard plan costs $12.99 per month. Your subscription renews automatically at the end of each billing period unless cancelled. We may modify the subscription fee upon notice to you, and continued use after the change constitutes acceptance.

Cancellation. You may cancel at any time from your account settings; access continues until the end of the current billing period. We do not charge a cancellation fee. Refunds are not provided for partial billing periods, and all payments are non-refundable.

Changes to these Terms. We reserve the right to amend these terms and conditions at any time. Material changes will be notified via email or in-app notice.

Disputes. Any dispute arising from these Terms shall be resolved through binding arbitration on an individual basis. You waive any right to bring or participate in a class action.

Limitation of Liability. The service is provided "as is" without warranties of any kind. Streamly+ shall not be liable for indirect or consequential damages; our total liability is limited to the amounts you paid in the three months preceding the claim.

Data. We may share your usage data and device information with third-party partners to personalize advertising. You can manage advertising preferences in settings.

Accounts. You are responsible for activity under your account. We may suspend or terminate accounts at our sole discretion for violation of these Terms.`,
  },
  {
    id: "lease",
    label: "Apartment lease",
    kind: "Residential lease excerpt",
    text: `RESIDENTIAL LEASE AGREEMENT (excerpt) — 14 MAPLE STREET, APT 3B

This lease is made between Hartwell Property Group ("Landlord") and the undersigned ("Tenant") for the premises located at 14 Maple Street, Apartment 3B.

Term. The lease term begins June 1, 2026 and ends May 31, 2027.

Rent. Tenant shall pay monthly rent of $1,850, due on the first day of each month by check or electronic transfer. Rent is due no later than the 1st; a grace period applies through the 5th day of the month.

Late Charges. Rent received after the 5th incurs a late fee equal to 5% of the monthly rent.

Security Deposit. Tenant shall deposit $1,850 as security. The deposit will be returned within 30 days of move-out, less lawful deductions for unpaid rent or damage beyond normal wear. Failure to provide a forwarding address may forfeit the deposit.

Renewal and Notice. This lease does not renew automatically. Either party must give at least 60 days written notice before the end of the term to terminate or to negotiate renewal; otherwise the tenancy converts to month-to-month at 125% of the last monthly rent.

Utilities. Tenant is responsible for electricity, gas, internet, and water. Landlord is responsible for building insurance and common-area maintenance.

Maintenance. Tenant must keep the premises clean and promptly report defects. Tenant may not alter the premises without Landlord's written consent.

Quiet Enjoyment. Tenant shall not disturb neighbors and must comply with building rules, which Landlord may amend with 30 days notice.

Access. Landlord may enter the premises with 24 hours notice, or without notice in an emergency.`,
  },
];
