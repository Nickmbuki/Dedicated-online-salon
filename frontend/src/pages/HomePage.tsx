import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarCheck, HeartHandshake, Home, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { ShareButton } from "../components/ShareButton";

const heroImage = "https://images.unsplash.com/photo-1672622934288-08b77766e7e3?auto=format&fit=crop&w=1100&q=72";

const hairstylePhotos = [
  {
    label: "Kenyan braids with a polished finish",
    src: "https://images.unsplash.com/photo-1762522929454-ee9a3c765f59?auto=format&fit=crop&w=520&q=72"
  },
  {
    label: "Elegant braided home styling",
    src: "https://images.unsplash.com/photo-1606415918835-88d0614e75ad?auto=format&fit=crop&w=520&q=72"
  },
  {
    label: "African protective hairstyle",
    src: "https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?auto=format&fit=crop&w=520&q=72"
  },
  {
    label: "Soft glam braids for events",
    src: "https://images.unsplash.com/photo-1572955304332-bf714bd49add?auto=format&fit=crop&w=520&q=72"
  },
  {
    label: "Beautiful African locs and styling",
    src: "https://images.unsplash.com/photo-1624823574478-acf031dec181?auto=format&fit=crop&w=520&q=72"
  },
  {
    label: "Refined home salon hairstyle",
    src: "https://images.unsplash.com/photo-1616166183781-0fdd2ef83374?auto=format&fit=crop&w=520&q=72"
  },
  {
    label: "Statement braids with luxury finish",
    src: "https://images.unsplash.com/photo-1613099084406-4b9140fc780a?auto=format&fit=crop&w=520&q=72"
  },
  {
    label: "Neat protective style for confidence",
    src: "https://images.unsplash.com/photo-1535588706069-af8f2d837332?auto=format&fit=crop&w=520&q=72"
  }
];

const hairStylesProvided = [
  { name: "African plaiting", src: "https://images.unsplash.com/photo-1684200757007-a3af11299189?auto=format&fit=crop&w=440&q=72" },
  { name: "Box braids", src: "https://images.unsplash.com/photo-1662991859083-86e0b45208b0?auto=format&fit=crop&w=440&q=72" },
  { name: "Knotless braids", src: "https://images.unsplash.com/photo-1572955304332-bf714bd49add?auto=format&fit=crop&w=440&q=72" },
  { name: "Cornrows", src: "https://images.unsplash.com/photo-1606415918835-88d0614e75ad?auto=format&fit=crop&w=440&q=72" },
  { name: "Twists", src: "https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?auto=format&fit=crop&w=440&q=72" },
  { name: "Loc styling", src: "https://images.unsplash.com/photo-1624823574478-acf031dec181?auto=format&fit=crop&w=440&q=72" },
  { name: "Natural hair styling", src: "https://images.unsplash.com/photo-1535588706069-af8f2d837332?auto=format&fit=crop&w=440&q=72" },
  { name: "Wedding hairstyles", src: "https://images.unsplash.com/photo-1672622934288-08b77766e7e3?auto=format&fit=crop&w=440&q=72" }
];

const testimonials = [
  { area: "Ruaka", name: "Mercy W.", text: "The stylist arrived on time, handled my daughter's hair gently, and the plaits stayed neat for school." },
  { area: "Runda", name: "Cynthia M.", text: "My wedding preparation felt calm and premium. Hair, nails, and final styling were all done at home." },
  { area: "Kiambu", name: "Faith N.", text: "The booking was simple, hygiene was excellent, and the hairstyle looked polished for my interview." },
  { area: "Muchatha", name: "Grace A.", text: "Professional door-to-door care with beautiful African plaiting and no rushing." },
  { area: "Banana", name: "Lydia K.", text: "Warm service, clean tools, and a soft touch for children. I will book again." },
  { area: "Ndenderu", name: "Ann W.", text: "Reliable home salon service for family events. Everyone looked elegant and ready." }
];

export const HomePage = () => (
  <PageTransition>
    <section className="relative overflow-hidden">
      <img className="absolute inset-0 h-full w-full object-cover object-center" src={heroImage} alt="Close-up of elegant braided hairstyle" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-rosewood/64 to-rosewood/30" />
      <div className="relative mx-auto grid min-h-[70vh] max-w-7xl items-start gap-8 px-4 pb-10 pt-7 sm:px-5 sm:pb-14 sm:pt-12 lg:min-h-[78vh] lg:grid-cols-[1fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl text-white">
          <p className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne backdrop-blur sm:text-sm sm:tracking-[0.18em]">
            <Home size={16} /> Door-to-door online salon
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">Elegant Beauty Style Suite</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/86 sm:text-base sm:leading-8">
            A purely online, door-to-door salon experience for African plaiting, hairstyles for every hair type, nails, skincare, children, weddings, interviews, and special events.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-champagne px-6 py-3 text-sm font-bold text-ink sm:w-auto" to="/book">
              Book appointment <ArrowRight size={17} />
            </Link>
            <Link className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-bold text-white sm:w-auto" to="/gallery">
              View gallery
            </Link>
            <ShareButton />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:translate-y-[-1px] hover:bg-[#22c35b]"
              href="https://wa.me/254726432210"
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with Elegant Beauty Style Suite on WhatsApp"
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur">
              0726432210
            </span>
          </div>
        </motion.div>
        <div className="hidden grid-cols-2 gap-3 sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-2">
          {hairstylePhotos.slice(0, 6).map((image, index) => (
            <motion.figure
              key={image.label}
              className={`aspect-[3/4] overflow-hidden rounded-lg border border-white/25 bg-champagne/30 shadow-soft ${index === 0 || index === 5 ? "sm:row-span-2" : ""}`}
              animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
              transition={{ duration: 4.5 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.035 }}
            >
              <img className="h-full w-full object-cover" src={image.src} alt={image.label} loading={index === 0 ? "eager" : "lazy"} />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>

    <section className="px-5 py-16">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
        {[
          { icon: BadgeCheck, title: "Years of expertise", body: "Refined preparation for weddings, interviews, events, and graceful everyday looks." },
          { icon: ShieldCheck, title: "Professional hygiene", body: "Clean tools, careful handling, and polished salon standards." },
          { icon: CalendarCheck, title: "Reliable booking", body: "Available slots only, with collision prevention built into the API." },
          { icon: HeartHandshake, title: "Gentle children care", body: "Patient service for children with comfort and calm handling emphasized." }
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <item.icon className="text-rosewood" size={24} />
            <h2 className="mt-4 font-display text-2xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">{item.body}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-porcelain px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rosewood">Hairstyles provided</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold sm:text-5xl">Choose a beautiful look for your home appointment</h2>
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hairStylesProvided.map((style, index) => (
            <motion.article
              key={style.name}
              className="group overflow-hidden rounded-lg border border-rosewood/15 bg-porcelain/85 shadow-soft"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              whileHover={{ y: -7 }}
            >
              <div className="aspect-[4/3] overflow-hidden bg-champagne/30">
                <img className="h-full w-full object-cover transition duration-700 group-hover:scale-110" src={style.src} alt={style.name} loading="lazy" />
              </div>
              <div className="p-4">
                <p className="font-display text-2xl font-semibold text-ink">{style.name}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    <section className="px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rosewood">Loved around Nairobi and Kiambu</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold sm:text-5xl">Testimonials from nearby homes and families</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <article key={`${item.area}-${item.name}`} className="rounded-lg border border-rosewood/15 bg-white p-6 shadow-sm">
              <p className="text-sm leading-7 text-ink/70">"{item.text}"</p>
              <div className="mt-5 border-t border-ink/10 pt-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm font-semibold text-rosewood">{item.area}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  </PageTransition>
);
