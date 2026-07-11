"use client";

import { useState, type FormEvent } from "react";
import type { EventType } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

const EVENT_TYPES: EventType[] = ["Corporate Retreat", "Conference", "Film Festival", "Wedding", "Other"];

const initialForm = {
  event_name: "",
  event_type: "Corporate Retreat" as EventType,
  attendee_count: "",
  preferred_dates: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  message: "",
};

export default function EventInquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof typeof initialForm>(key: K, value: (typeof initialForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/event-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          attendee_count: Number(form.attendee_count) || 0,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-tombstone-navy/20 bg-tombstone-navy/5 p-8 text-center">
        <h3 className="font-display text-xl font-bold text-tombstone-navy">Inquiry sent.</h3>
        <p className="mt-2 text-sm text-tombstone-dark/70">
          We&apos;ll connect you with venues, coordinate logistics, and help market your event. Expect to hear from us soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Event name" required>
        <input
          required
          value={form.event_name}
          onChange={(e) => update("event_name", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Event type" required>
        <select
          value={form.event_type}
          onChange={(e) => update("event_type", e.target.value as EventType)}
          className={inputClass}
        >
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Expected attendees" required>
        <input
          required
          type="number"
          min={1}
          value={form.attendee_count}
          onChange={(e) => update("attendee_count", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Preferred dates" required>
        <input
          required
          placeholder="e.g. March 2027, flexible"
          value={form.preferred_dates}
          onChange={(e) => update("preferred_dates", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Contact name" required>
        <input
          required
          value={form.contact_name}
          onChange={(e) => update("contact_name", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Contact email" required>
        <input
          required
          type="email"
          value={form.contact_email}
          onChange={(e) => update("contact_email", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Contact phone">
        <input
          type="tel"
          value={form.contact_phone}
          onChange={(e) => update("contact_phone", e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Message / details">
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-md bg-tombstone-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-tombstone-red/90 disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Sending…" : "Send Inquiry"}
        </button>
        {status === "error" && <p className="mt-2 text-xs text-tombstone-red">{errorMessage}</p>}
        <p className="mt-3 text-xs text-tombstone-dark/50">
          We&apos;ll connect you with venues, coordinate logistics, and help market your event.
        </p>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-tombstone-dark focus:border-tombstone-red focus:outline-none";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-tombstone-dark">
      {label}
      {required && <span className="text-tombstone-red"> *</span>}
      {children}
    </label>
  );
}
