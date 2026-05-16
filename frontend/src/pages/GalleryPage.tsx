import { motion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";

const gallery = [
  ["Kenyan braids with a polished finish", "https://images.unsplash.com/photo-1762522929454-ee9a3c765f59?auto=format&fit=crop&w=1000&q=88"],
  ["Elegant braided home styling", "https://images.unsplash.com/photo-1606415918835-88d0614e75ad?auto=format&fit=crop&w=1000&q=88"],
  ["African protective hairstyle", "https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?auto=format&fit=crop&w=1000&q=88"],
  ["Soft glam braids", "https://images.unsplash.com/photo-1572955304332-bf714bd49add?auto=format&fit=crop&w=1000&q=88"],
  ["Beautiful loc styling", "https://images.unsplash.com/photo-1624823574478-acf031dec181?auto=format&fit=crop&w=1000&q=88"],
  ["Statement braids", "https://images.unsplash.com/photo-1613099084406-4b9140fc780a?auto=format&fit=crop&w=1000&q=88"],
  ["Polished natural hairstyle", "https://images.unsplash.com/photo-1535588706069-af8f2d837332?auto=format&fit=crop&w=1000&q=88"],
  ["Refined braided portrait", "https://images.unsplash.com/photo-1592520113018-180c8bc831c9?auto=format&fit=crop&w=1000&q=88"]
];

export const GalleryPage = () => (
  <PageTransition>
    <section className="mx-auto max-w-7xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rosewood">Gallery</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold sm:text-5xl">Beautiful hairstyles delivered to your door</h1>
      <p className="mt-4 max-w-3xl leading-8 text-ink/68">
        A professional visual gallery for African plaiting, diverse hair textures, nails, skincare, and children's salon care prepared for home appointments.
      </p>
      <div className="mt-10 grid auto-rows-[240px] gap-4 sm:auto-rows-[280px] md:grid-cols-3 md:gap-5">
        {gallery.map(([label, src], index) => (
          <motion.figure
            key={label}
            className={`group overflow-hidden rounded-lg bg-rosewood/15 shadow-soft ${index === 0 || index === 4 ? "md:row-span-2" : ""}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: index * 0.04 }}
            whileHover={{ y: -7 }}
          >
            <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={src} alt={label} loading="lazy" />
          </motion.figure>
        ))}
      </div>
    </section>
  </PageTransition>
);
