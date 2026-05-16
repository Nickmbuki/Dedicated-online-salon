import { Scissors, ShieldCheck, Sparkles } from "lucide-react";
import { PageTransition } from "../components/PageTransition";

export const AboutPage = () => (
  <PageTransition>
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rosewood">About</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">An expert stylist for moments that matter</h1>
        <p className="mt-5 leading-8 text-ink/70">
          Elegant Beauty Style Suite is built around years of hands-on salon experience preparing clients at home for weddings, interviews, special events, and everyday confidence. Every appointment is booked online and handled with warmth, calm timing, and professional hygiene.
        </p>
        <p className="mt-4 leading-8 text-ink/70">
          Children receive gentle handling, patient communication, and styles that prioritize comfort. Every service is door-to-door so clients receive professional care at home.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { icon: Scissors, title: "All hair types", body: "Hairstyles for natural, relaxed, curly, coily, straight, and protective styling needs." },
          { icon: ShieldCheck, title: "Hygiene first", body: "Clean tools, tidy setup, and care that respects the client and the occasion." },
          { icon: Sparkles, title: "Event ready", body: "Wedding, interview, and special event grooming with a polished finish." }
        ].map((item) => (
          <article key={item.title} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <item.icon className="text-rosewood" size={26} />
            <h2 className="mt-4 font-display text-3xl font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink/65">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  </PageTransition>
);
