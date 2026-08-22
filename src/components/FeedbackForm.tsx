"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "@/components/StarRating";

const FEEDBACK_TYPES: { value: string; label: string }[] = [
  { value: "GENERAL", label: "General feedback" },
  { value: "FEATURE_REQUEST", label: "Feature request" },
  { value: "BUG", label: "Bug / problem" },
  { value: "IMPROVEMENT", label: "Improvement suggestion" },
];

export function FeedbackForm({
  token,
  appName,
  appColor,
  initialRating = 0,
  initialComment = "",
  initialSuggestion = "",
  initialType = "GENERAL",
}: {
  token: string;
  appName: string;
  appColor: string;
  initialRating?: number;
  initialComment?: string;
  initialSuggestion?: string;
  initialType?: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [suggestion, setSuggestion] = useState(initialSuggestion);
  const [type, setType] = useState(initialType);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/v1/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, rating, comment, suggestion, type }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(`/feedback/${token}/thank-you`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <h2 className="mb-4 text-center text-lg font-semibold text-ink">
          How was your experience with {appName}?
        </h2>
        <StarRating value={rating} onChange={setRating} color={appColor} />
      </div>

      <div>
        <label htmlFor="comment" className="mb-2 block text-sm font-semibold text-ink">
          Tell us more
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts with us..."
          rows={4}
          className="w-full rounded-lg border border-zinc-200 p-3 text-sm outline-none focus:border-zinc-400"
        />
      </div>

      <div>
        <label htmlFor="suggestion" className="mb-2 block text-sm font-semibold text-ink">
          Got ideas or suggestions?
        </label>
        <p className="mb-2 text-sm text-zinc-500">
          Is there a feature or improvement you&apos;d love to see in {appName}?
        </p>
        <textarea
          id="suggestion"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder="I'd love to see..."
          rows={4}
          className="w-full rounded-lg border border-zinc-200 p-3 text-sm outline-none focus:border-zinc-400"
        />
      </div>

      <div>
        <span className="mb-2 block text-sm font-semibold text-ink">
          What kind of feedback is this?
        </span>
        <div className="grid grid-cols-2 gap-2">
          {FEEDBACK_TYPES.map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border p-3 text-sm ${
                type === option.value
                  ? "border-ink bg-zinc-50 font-semibold"
                  : "border-zinc-200 text-zinc-600"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={option.value}
                checked={type === option.value}
                onChange={() => setType(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        style={{ backgroundColor: appColor }}
        className="rounded-lg py-3.5 text-base font-semibold text-white transition-opacity disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
