"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const initialForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: ""
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || "Unable to create account.");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <main className="bg-[#fff7f1] px-4 py-16 text-[#5b1725] sm:px-8 sm:py-20 lg:px-14 lg:py-28">
      <section className="mx-auto max-w-2xl rounded-lg border border-[#d8c1b4] bg-white p-6 shadow-[0_20px_60px_rgba(43,35,32,0.1)]">
        <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">Customer account</p>
        <h1 className="serif text-4xl font-bold leading-none sm:text-5xl">Create account</h1>
        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-black">
              First name
              <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" onChange={(event) => updateField("firstName", event.target.value)} required value={form.firstName} />
            </label>
            <label className="grid gap-2 text-sm font-black">
              Last name
              <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" onChange={(event) => updateField("lastName", event.target.value)} required value={form.lastName} />
            </label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-black">
              Date of birth
              <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" onChange={(event) => updateField("dateOfBirth", event.target.value)} required type="date" value={form.dateOfBirth} />
            </label>
            <label className="grid gap-2 text-sm font-black">
              Phone number
              <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" onChange={(event) => updateField("phoneNumber", event.target.value)} required type="tel" value={form.phoneNumber} />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-black">
            Email
            <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" onChange={(event) => updateField("email", event.target.value)} required type="email" value={form.email} />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-black">
              Password
              <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" minLength={8} onChange={(event) => updateField("password", event.target.value)} required type="password" value={form.password} />
            </label>
            <label className="grid gap-2 text-sm font-black">
              Confirm password
              <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" minLength={8} onChange={(event) => updateField("confirmPassword", event.target.value)} required type="password" value={form.confirmPassword} />
            </label>
          </div>
          {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
          <button className="rounded-lg bg-[#2b2320] px-5 py-3 text-sm font-black text-white" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
          <p className="text-sm text-[#6f5d55]">
            Already have an account?{" "}
            <Link className="font-black text-[#9f5f6f]" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
