"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || "Unable to sign in.");
      return;
    }

    const result = await response.json();
    router.push(result.user?.role === "admin" ? "/admin" : "/account");
    router.refresh();
  }

  return (
    <main className="bg-[#fff7f1] px-4 py-16 text-[#5b1725] sm:px-8 sm:py-20 lg:px-14 lg:py-28">
      <section className="mx-auto max-w-xl rounded-lg border border-[#d8c1b4] bg-white p-6 shadow-[0_20px_60px_rgba(43,35,32,0.1)]">
        <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">Account</p>
        <h1 className="serif text-4xl font-bold leading-none sm:text-5xl">Sign in</h1>
        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-black">
            Email
            <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
          </label>
          <label className="grid gap-2 text-sm font-black">
            Password
            <input className="rounded-lg border border-[#d8c1b4] bg-[#fff7f1] px-4 py-3 font-normal" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
          </label>
          {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
          <button className="rounded-lg bg-[#2b2320] px-5 py-3 text-sm font-black text-white" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-sm text-[#6f5d55]">
            Do not have an account?{" "}
            <Link className="font-black text-[#9f5f6f]" href="/signup">
              Create one
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
