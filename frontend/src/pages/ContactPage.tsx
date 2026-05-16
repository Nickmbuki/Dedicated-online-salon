import { Mail, MapPin, Phone } from "lucide-react";
import { PageTransition } from "../components/PageTransition";

export const ContactPage = () => (
  <PageTransition>
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="grid overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft lg:grid-cols-[1fr_0.9fr]">
        <div className="p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rosewood">Contact</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">Reserve your home salon experience</h1>
          <p className="mt-5 leading-8 text-ink/68">
            Call or email for questions about door-to-door bookings, children hair care, bridal preparation, African plaiting, or interview grooming packages.
          </p>
          <div className="mt-8 grid gap-4">
            <a className="flex items-center gap-3 rounded-lg bg-pearl p-4 font-semibold" href="tel:0726432210">
              <Phone size={20} className="text-rosewood" /> 0726432210
            </a>
            <a className="flex items-center gap-3 rounded-lg bg-pearl p-4 font-semibold" href="tel:0108501768">
              <Phone size={20} className="text-rosewood" /> 0108501768
            </a>
            <a className="flex items-center gap-3 rounded-lg bg-pearl p-4 font-semibold" href="mailto:lydiahm214@gmail.com">
              <Mail size={20} className="text-rosewood" /> lydiahm214@gmail.com
            </a>
          </div>
        </div>
        <div className="bg-ink p-8 text-porcelain sm:p-12">
          <MapPin className="text-champagne" size={30} />
          <h2 className="mt-5 font-display text-4xl font-semibold">Door-to-door salon care</h2>
          <p className="mt-4 leading-8 text-porcelain/75">
            Home services are available for selected styling and event preparation appointments. Add your address while booking so the stylist can plan timing and setup.
          </p>
        </div>
      </div>
    </section>
  </PageTransition>
);
