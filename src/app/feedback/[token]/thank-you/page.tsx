export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-card">
        <div className="mb-4 text-5xl">🎉</div>
        <h1 className="mb-2 text-xl font-bold text-ink">Thank you for your feedback!</h1>
        <p className="text-sm text-zinc-500">
          We really appreciate you taking the time to share your thoughts. Your feedback
          helps us build a better product for everyone.
        </p>
      </div>
    </main>
  );
}
