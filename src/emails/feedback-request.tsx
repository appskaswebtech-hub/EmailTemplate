import * as React from "react";
import {
  Body,
  Column,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export interface FeedbackRequestEmailProps {
  appName: string;
  appLogo: string;
  appColor: string;
  merchantName: string;
  feedbackUrl: string;
  reviewUrl?: string;
}

/**
 * Everything below is static copy/layout matching the approved design. Only
 * appName, appLogo, merchantName, feedbackUrl (and the subject line, set in
 * send-feedback-request.ts) are dynamic per send.
 */
export default function FeedbackRequestEmail({
  appName,
  appLogo,
  appColor,
  merchantName,
  feedbackUrl,
  reviewUrl,
}: FeedbackRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Help us make {appName} even better!</Preview>
      <Body style={styles.body}>
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={styles.outerTable}
        >
          <tbody>
            <tr>
              <td align="center">
                <Section style={styles.card}>
                  {/* Colored header band + logo badge */}
                  <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            ...styles.headerBand,
                            backgroundColor: appColor,
                            backgroundImage: `linear-gradient(135deg, ${appColor}, #18181b)`,
                          }}
                        />
                      </tr>
                    </tbody>
                  </table>

                  <table role="presentation" cellPadding={0} cellSpacing={0} style={styles.logoBadgeTable}>
                    <tbody>
                      <tr>
                        <td style={styles.logoBadge}>
                          <Img src={appLogo} width="48" height="48" alt={appName} style={styles.logoBadgeImg} />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={styles.cardBody}>
                    <Text style={styles.brandName}>{appName}</Text>

                    <Text style={styles.heading}>
                      Help us make{" "}
                      <span style={{ color: appColor }}>{appName}</span> even
                      better!
                    </Text>
                    <Text style={styles.greeting}>
                      Dear <span style={{ color: appColor }}>{appName}</span> user,
                    </Text>
                    <Text style={styles.body1}>
                      Thank you for using <strong>{appName}</strong>. We&apos;d
                      love to hear your thoughts and suggestions to improve your
                      experience.
                    </Text>

                  <Section style={styles.divider} />

                  {/* Section 1: rating */}
                  <Row>
                    <Column style={{ width: "36px", verticalAlign: "top" }}>
                      <table role="presentation" cellPadding={0} cellSpacing={0}>
                        <tbody>
                          <tr>
                            <td style={{ ...styles.stepBadge, backgroundColor: appColor }}>1</td>
                          </tr>
                        </tbody>
                      </table>
                    </Column>
                    <Column style={{ verticalAlign: "top" }}>
                      <Text style={styles.sectionHeading}>
                        How was your experience with {appName}?
                      </Text>
                      <Text style={styles.sectionSubtext}>
                        Your feedback helps us improve and deliver what matters most
                        to you.
                      </Text>
                    </Column>
                  </Row>

                  <Link href={feedbackUrl} style={{ ...styles.textBox, borderLeft: `3px solid ${appColor}` }}>
                    <span style={styles.textBoxLabel}>Tell us more (optional)</span>
                    <br />
                    <span style={styles.textBoxPlaceholder}>Share your thoughts with us...</span>
                  </Link>

                  {/* Section 2: suggestions */}
                  <Row style={{ marginTop: "28px" }}>
                    <Column style={{ width: "36px", verticalAlign: "top" }}>
                      <table role="presentation" cellPadding={0} cellSpacing={0}>
                        <tbody>
                          <tr>
                            <td style={{ ...styles.stepBadge, backgroundColor: "#22c55e" }}>2</td>
                          </tr>
                        </tbody>
                      </table>
                    </Column>
                    <Column style={{ verticalAlign: "top" }}>
                      <Text style={styles.sectionHeading}>Got ideas or suggestions?</Text>
                      <Text style={styles.sectionSubtext}>
                        We&apos;re always looking for new ideas to make {appName}{" "}
                        more powerful for you.
                      </Text>
                    </Column>
                  </Row>

                  <Link href={feedbackUrl} style={{ ...styles.textBox, borderLeft: `3px solid ${appColor}` }}>
                    <span style={styles.textBoxLabel}>
                      What features or improvements would you like to see?
                    </span>
                  </Link>

                  {/* CTA */}
                  <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: "28px" }}>
                    <tbody>
                      <tr>
                        <td align="center">
                          <Link
                            href={feedbackUrl}
                            style={{
                              ...styles.button,
                              backgroundColor: appColor,
                              backgroundImage: `linear-gradient(135deg, ${appColor}, #18181b)`,
                            }}
                          >
                            Submit Feedback
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {reviewUrl && (
                    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: "12px" }}>
                      <tbody>
                        <tr>
                          <td align="center">
                            <Link
                              href={reviewUrl}
                              style={{ ...styles.secondaryButton, color: appColor, borderColor: appColor }}
                            >
                              Leave a Review
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  <Text style={styles.footerNote}>
                    It only takes 2 minutes and makes a big difference!
                  </Text>

                  <Section style={styles.cardCopyrightDivider} />
                  <Text style={styles.cardCopyright}>
                    &copy; {new Date().getFullYear()} {appName}. All rights reserved.
                  </Text>
                  </div>
                </Section>
              </td>
            </tr>
          </tbody>
        </table>
      </Body>
    </Html>
  );
}

FeedbackRequestEmail.PreviewProps = {
  appName: "WishKeeper",
  appLogo: "https://placehold.co/72x72/6366f1/ffffff.png?text=WK",
  appColor: "#6366f1",
  merchantName: "Adom",
  feedbackUrl: "https://feedback.kaswebtech.com/feedback/example-token",
  reviewUrl: "https://apps.shopify.com/wishkeeper#modal-show=WriteReviewModal",
} satisfies FeedbackRequestEmailProps;

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
    padding: "40px 0",
  },
  outerTable: { maxWidth: "600px", margin: "0 auto" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px -12px rgba(24,24,27,0.18)",
    margin: "0 12px",
    padding: 0,
    overflow: "hidden",
  },
  headerBand: {
    height: "64px",
    borderRadius: "20px 20px 0 0",
  },
  logoBadgeTable: {
    margin: "-32px auto 0",
  },
  logoBadge: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    border: "3px solid #ffffff",
    boxShadow: "0 4px 12px rgba(24,24,27,0.14)",
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
  },
  logoBadgeImg: {
    display: "block",
    margin: "0 auto",
    borderRadius: "50%",
  },
  cardBody: {
    padding: "16px 28px 32px",
    textAlign: "center" as const,
  },
  brandName: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#71717a",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    margin: "0 0 10px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#18181b",
    margin: "0 0 14px",
    lineHeight: 1.25,
  },
  greeting: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#27272a",
    margin: "0 0 6px",
  },
  body1: {
    fontSize: "14px",
    color: "#52525b",
    lineHeight: 1.6,
    margin: "0 auto",
    maxWidth: "420px",
  },
  divider: {
    borderTop: "1px dashed #e4e4e7",
    margin: "28px 0 24px",
  },
  stepBadge: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
    lineHeight: "26px",
  },
  sectionHeading: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#18181b",
    margin: "0 0 4px",
  },
  sectionSubtext: {
    fontSize: "13px",
    color: "#71717a",
    margin: "0 0 14px",
    lineHeight: 1.5,
  },
  textBox: {
    display: "block",
    border: "1px solid #ececef",
    borderRadius: "10px",
    padding: "14px 18px",
    marginBottom: "10px",
    textDecoration: "none",
    backgroundColor: "#fafafa",
  },
  textBoxLabel: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#27272a",
  },
  textBoxPlaceholder: {
    fontSize: "12px",
    color: "#a1a1aa",
  },
  button: {
    display: "inline-block",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 700,
    textDecoration: "none",
    padding: "15px 48px",
    borderRadius: "999px",
    letterSpacing: "0.02em",
    boxShadow: "0 8px 20px -6px rgba(24,24,27,0.35)",
  },
  secondaryButton: {
    display: "inline-block",
    fontSize: "14px",
    fontWeight: 700,
    textDecoration: "none",
    padding: "13px 40px",
    borderRadius: "999px",
    border: "2px solid",
    backgroundColor: "#ffffff",
  },
  footerNote: {
    fontSize: "13px",
    color: "#71717a",
    textAlign: "center" as const,
    margin: "16px 0 20px",
  },
  cardCopyrightDivider: {
    borderTop: "1px solid #f0f0f2",
    margin: "4px 0 16px",
  },
  cardCopyright: {
    fontSize: "11px",
    color: "#a1a1aa",
    textAlign: "center" as const,
    margin: 0,
  },
};
