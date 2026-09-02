import { render } from "@react-email/components";
import { getSmtpTransporter } from "@/lib/email/smtp";
import FeedbackRequestEmail from "@/emails/feedback-request";
import { env } from "@/lib/env";

export interface SendFeedbackRequestEmailParams {
  toEmail: string;
  appName: string;
  appLogo: string;
  appColor: string;
  merchantName: string;
  feedbackUrl: string;
  reviewUrl?: string;
}

export interface SendFeedbackRequestEmailResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export async function sendFeedbackRequestEmail(
  params: SendFeedbackRequestEmailParams
): Promise<SendFeedbackRequestEmailResult> {
  const html = await render(
    FeedbackRequestEmail({
      appName: params.appName,
      appLogo: params.appLogo,
      appColor: params.appColor,
      merchantName: params.merchantName,
      feedbackUrl: params.feedbackUrl,
      reviewUrl: params.reviewUrl,
    })
  );

  try {
    const transporter = getSmtpTransporter();
    const info = await transporter.sendMail({
      from: `"${params.appName} Team" <${env.smtpUser}>`,
      to: params.toEmail,
      subject: `Help us make ${params.appName} even better!`,
      html,
    });

    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown email error" };
  }
}
