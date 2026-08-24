function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get appBaseUrl() {
    return required("APP_BASE_URL");
  },
  get smtpUser() {
    return required("SMTP_USER");
  },
  get smtpPass() {
    return required("SMTP_PASS");
  },
};
