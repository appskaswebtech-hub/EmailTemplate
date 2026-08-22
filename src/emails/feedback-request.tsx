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
  quickRateUrl: string;
  companyName: string;
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
  quickRateUrl,
  companyName,
}: FeedbackRequestEmailProps) {
  const ratingUrl = (rating: number) => `${quickRateUrl}&rating=${rating}`;

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
                        <td style={{ ...styles.headerBand, backgroundColor: appColor }} />
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
                    <Text style={styles.brandName}>{companyName}</Text>

                    <Text style={styles.heading}>
                      Help us make{" "}
                      <span style={{ color: appColor }}>{appName}</span> even
                      better!
                    </Text>
                    <Text style={styles.greeting}>
                      Hey <span style={{ color: appColor }}>{merchantName}</span>,
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

                  <Link href={feedbackUrl} style={styles.textBox}>
                    <span style={styles.textBoxIcon}>&#128172;</span>
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

                  <Link href={feedbackUrl} style={{ ...styles.textBox, backgroundColor: "#f0fdf4" }}>
                    <span style={styles.textBoxLabel}>
                      What features or improvements would you like to see?
                    </span>
                    <span style={styles.textBoxIconRight}>&#9998;</span>
                  </Link>

                  {/* CTA */}
                  <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: "28px" }}>
                    <tbody>
                      <tr>
                        <td align="center">
                          <Link
                            href={feedbackUrl}
                            style={{ ...styles.button, backgroundColor: appColor }}
                          >
                            &#9993; Submit Feedback
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <Text style={styles.footerNote}>
                    &#10084; It only takes 2 minutes and makes a big difference!
                  </Text>

                  {/* 3-column footer strip */}
                  <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={styles.stripTable}>
                    <tbody>
                      <tr>
                        <td style={styles.stripCell}>
                          <div style={{ ...styles.stripIcon, backgroundColor: "#fee2e2" }}>&#10084;</div>
                          <Text style={styles.stripHeading}>Love something?</Text>
                          <Text style={styles.stripText}>
                            Let us know what you like about {appName}.
                          </Text>
                        </td>
                        <td style={styles.stripCell}>
                          <div style={{ ...styles.stripIcon, backgroundColor: "#fef3c7" }}>&#128161;</div>
                          <Text style={styles.stripHeading}>Have an idea?</Text>
                          <Text style={styles.stripText}>
                            Suggest features you&apos;d love to see in the app.
                          </Text>
                        </td>
                        <td style={styles.stripCell}>
                          <div style={{ ...styles.stripIcon, backgroundColor: "#dbeafe" }}>&#128027;</div>
                          <Text style={styles.stripHeading}>Found an issue?</Text>
                          <Text style={styles.stripText}>
                            Report any problems so we can fix them quickly.
                          </Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </Section>

                {/* Outer footer */}
                <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={styles.outerFooter}>
                  <tbody>
                    <tr>
                      <td style={{ width: "50%", verticalAlign: "top" }}>
                        <table role="presentation" cellPadding={0} cellSpacing={0}>
                          <tbody>
                            <tr>
                              <td style={styles.footerBrandBadge}>
                                <Img src={appLogo} width="16" height="16" alt="" style={styles.brandBadgeImg} />
                              </td>
                              <td style={styles.footerBrandName}>{companyName}</td>
                            </tr>
                          </tbody>
                        </table>
                        <Text style={styles.footerSmall}>
                          Built with &#10084; for amazing merchants like you.
                        </Text>
                        <Text style={styles.footerSmall}>
                          &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
                        </Text>
                      </td>
                      <td style={{ width: "50%", verticalAlign: "top" }} align="right">
                        <Text style={{ ...styles.footerSmall, fontWeight: 700, color: "#3f3f46" }}>
                          Need help?
                        </Text>
                        <Text style={styles.footerSmall}>We&apos;re always here for you.</Text>
                        <table role="presentation" cellPadding={0} cellSpacing={0} style={{ marginTop: "8px", marginLeft: "auto" }}>
                          <tbody>
                            <tr>
                              {["f", "\u{1D54F}", "in", "✉"].map((glyph) => (
                                <td key={glyph} style={styles.socialIcon}>
                                  {glyph}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
  quickRateUrl:
    "https://feedback.kaswebtech.com/api/v1/feedback/quick?token=example-token",
  companyName: "Kaswebtech",
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
  ratingBox: {
    border: "1px solid #ececef",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
  },
  ratingBoxTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#27272a",
    textAlign: "center" as const,
    margin: "0 0 10px",
  },
  starLink: {
    fontSize: "28px",
    color: "#fbbf24",
    textDecoration: "none",
  },
  ratingBoxLabel: {
    fontSize: "11px",
    color: "#a1a1aa",
    paddingTop: "6px",
  },
  textBox: {
    display: "block",
    border: "1px solid #ececef",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "8px",
    textDecoration: "none",
    backgroundColor: "#fafafa",
  },
  textBoxIcon: {
    fontSize: "14px",
    marginRight: "6px",
  },
  textBoxIconRight: { fontSize: "14px", float: "right" as const },
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
    padding: "14px 40px",
    borderRadius: "10px",
  },
  footerNote: {
    fontSize: "13px",
    color: "#71717a",
    textAlign: "center" as const,
    margin: "14px 0 24px",
  },
  stripTable: {
    borderTop: "1px solid #f0f0f2",
    paddingTop: "20px",
  },
  stripCell: {
    width: "33.33%",
    verticalAlign: "top" as const,
    padding: "0 8px",
    textAlign: "center" as const,
  },
  stripIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    margin: "0 auto 8px",
    fontSize: "15px",
    lineHeight: "34px",
    textAlign: "center" as const,
  },
  stripHeading: {
    fontSize: "12.5px",
    fontWeight: 700,
    color: "#27272a",
    margin: "0 0 2px",
  },
  stripText: {
    fontSize: "11.5px",
    color: "#a1a1aa",
    margin: 0,
    lineHeight: 1.4,
  },
  outerFooter: { padding: "24px 20px 0" },
  footerBrandBadge: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    backgroundColor: "#e4e4e7",
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
  },
  brandBadgeImg: { borderRadius: "6px", verticalAlign: "middle" as const },
  footerBrandName: {
    paddingLeft: "8px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#3f3f46",
    verticalAlign: "middle" as const,
  },
  footerSmall: {
    fontSize: "11.5px",
    color: "#a1a1aa",
    margin: "6px 0 0",
  },
  socialIcon: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    backgroundColor: "#f4f4f6",
    color: "#71717a",
    fontSize: "11px",
    fontWeight: 700,
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
    lineHeight: "26px",
  },
};
