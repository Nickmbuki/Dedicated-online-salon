import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ToggleLeft, ToggleRight } from "lucide-react";
import { createService, fetchAdminServices, updateService } from "../api/services";
import type { Service } from "../types";

type ServiceForm = {
  name: string;
  slug: string;
  category: Service["category"];
  description: string;
  priceCents: string;
  durationMinutes: number;
  imageUrl: string;
  isDoorToDoor: boolean;
};

export const AdminServicesManager = () => {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: services = [] } = useQuery({ queryKey: ["admin-services"], queryFn: fetchAdminServices });
  const { register, handleSubmit, reset, setValue, watch } = useForm<ServiceForm>({
    defaultValues: {
      category: "hair",
      durationMinutes: 60,
      isDoorToDoor: true
    }
  });
  const currentImageUrl = watch("imageUrl");

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setImagePreview(null);
      reset({ category: "hair", durationMinutes: 60, isDoorToDoor: true, name: "", slug: "", description: "", priceCents: "", imageUrl: "" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    await createMutation.mutateAsync({
      ...values,
      priceCents: values.priceCents ? Number(values.priceCents) * 100 : null,
      durationMinutes: Number(values.durationMinutes),
      isActive: true
    });
  });

  return (
    <section className="mt-10 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rosewood">Admin</p>
          <h2 className="font-display text-3xl font-semibold">Service management</h2>
        </div>
        <Plus className="text-rosewood" />
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={onSubmit}>
        <input className="field-input" placeholder="Service name" {...register("name", { required: true })} />
        <input className="field-input" placeholder="slug-example" {...register("slug", { required: true })} />
        <select className="field-input" {...register("category", { required: true })}>
          <option value="hair">Hair</option>
          <option value="children">Children</option>
          <option value="nails">Nails</option>
          <option value="skincare">Skincare</option>
          <option value="event">Event</option>
          <option value="home">Home</option>
        </select>
        <input className="field-input" type="number" placeholder="Duration minutes" {...register("durationMinutes", { required: true, valueAsNumber: true })} />
        <input className="field-input" type="number" placeholder="Price KES, leave empty for hairstyle services" {...register("priceCents")} />
        <label className="lg:col-span-2">
          <span className="field-label mt-0">Upload image</span>
          <input
            className="field-input"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                setImagePreview(null);
                setValue("imageUrl", "", { shouldValidate: true });
                return;
              }

              const reader = new FileReader();
              reader.onload = () => {
                const result = String(reader.result ?? "");
                setImagePreview(result);
                setValue("imageUrl", result, { shouldValidate: true });
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {imagePreview || currentImageUrl ? (
          <div className="overflow-hidden rounded-lg border border-rosewood/15 bg-porcelain lg:col-span-2">
            <img className="h-56 w-full object-cover" src={imagePreview ?? currentImageUrl} alt="Service preview" />
          </div>
        ) : null}
        <textarea className="field-input min-h-24 lg:col-span-2" placeholder="Description" {...register("description", { required: true })} />
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input type="checkbox" {...register("isDoorToDoor")} /> Door-to-door service
        </label>
        <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-porcelain disabled:opacity-50" type="submit" disabled={!currentImageUrl}>
          Add service
        </button>
      </form>

      <div className="mt-6 divide-y divide-ink/10">
        {services.map((service) => (
          <article key={service.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="font-semibold">{service.name}</p>
              <p className="text-sm text-ink/60">{service.durationMinutes} min · {service.category}</p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold"
              type="button"
              onClick={() => updateMutation.mutate({ id: service.id, isActive: !service.isActive })}
            >
              {service.isActive ? <ToggleRight size={18} className="text-sage" /> : <ToggleLeft size={18} className="text-ink/45" />}
              {service.isActive ? "Active" : "Hidden"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};
