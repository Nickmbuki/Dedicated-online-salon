import { motion } from "framer-motion";
import { CalendarPlus, Home, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import type { Service } from "../types";

const categoryLabels: Record<Service["category"], string> = {
  hair: "Hairstyle artistry",
  nails: "Nails",
  skincare: "Skincare",
  children: "Children",
  event: "Events",
  home: "Door-to-door"
};

const formatPrice = (service: Service) => {
  if (service.category === "hair" || service.category === "children" || service.priceCents == null) {
    return null;
  }
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(service.priceCents / 100);
};

export const ServiceCard = ({ service }: { service: Service }) => {
  const price = formatPrice(service);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="group overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm"
    >
      <div className="aspect-[4/3] overflow-hidden bg-pearl">
        <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={service.imageUrl} alt={service.name} loading="lazy" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-pearl px-3 py-1 text-xs font-semibold text-rosewood">{categoryLabels[service.category]}</span>
          {service.isDoorToDoor ? <Home size={17} className="text-sage" aria-label="Door-to-door available" /> : null}
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold">{service.name}</h3>
        <p className="mt-2 min-h-16 text-sm leading-6 text-ink/68">{service.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70">
            <Timer size={16} />
            {service.durationMinutes} min
          </span>
          {price ? <span className="text-sm font-semibold text-rosewood">{price}</span> : null}
          <Link className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-porcelain" to={`/book?service=${service.id}`} aria-label={`Book ${service.name}`}>
            <CalendarPlus size={17} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};
