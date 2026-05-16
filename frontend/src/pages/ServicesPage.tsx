import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "../api/services";
import { PageTransition } from "../components/PageTransition";
import { ServiceCard } from "../components/ServiceCard";

export const ServicesPage = () => {
  const { data: services = [], isLoading } = useQuery({ queryKey: ["services"], queryFn: fetchServices });

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rosewood">Services</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">Premium door-to-door salon services for every occasion</h1>
          <p className="mt-4 leading-8 text-ink/68">
            Book online and receive expert care at your location: African plaiting, hairstyles for all races and hair types, nails, skincare, legs washing and scrubbing, wedding preparation, interview grooming, and gentle children services.
          </p>
        </div>
        {isLoading ? <p className="mt-10 text-ink/60">Loading services...</p> : null}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    </PageTransition>
  );
};
