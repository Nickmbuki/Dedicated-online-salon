import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { createBooking, fetchAvailability, fetchServices } from "../api/services";
import { PageTransition } from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";

type BookingForm = {
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  address: string;
};

const today = new Date().toISOString().slice(0, 10);

export const BookingPage = () => {
  const [params] = useSearchParams();
  const selectedFromUrl = params.get("service") ?? "";
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const {
    data: services = [],
    isLoading: servicesLoading,
    isError: servicesError,
    error: servicesFetchError
  } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const { register, handleSubmit, watch, setValue, reset } = useForm<BookingForm>({
    defaultValues: {
      serviceId: selectedFromUrl,
      appointmentDate: today,
      customerName: user?.fullName ?? "",
      customerPhone: user?.phone ?? "",
      customerEmail: user?.email ?? ""
    }
  });

  const serviceId = watch("serviceId");
  const appointmentDate = watch("appointmentDate");
  const selectedService = useMemo(() => services.find((service) => service.id === serviceId), [serviceId, services]);

  const {
    data: slots = [],
    isFetching,
    isError: availabilityError
  } = useQuery({
    queryKey: ["availability", serviceId, appointmentDate],
    queryFn: () => fetchAvailability(serviceId, appointmentDate),
    enabled: Boolean(serviceId && appointmentDate)
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      reset({
        serviceId,
        appointmentDate,
        customerName: user?.fullName ?? "",
        customerPhone: user?.phone ?? "",
        customerEmail: user?.email ?? "",
        startTime: "",
        notes: "",
        address: ""
      });
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    await bookingMutation.mutateAsync(values);
  });

  return (
    <PageTransition>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rosewood">Book appointment</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">Choose only real available slots</h1>
          <p className="mt-5 leading-8 text-ink/68">
            Pick a service and date to see available times. The backend checks existing appointments and prevents double booking automatically.
          </p>
          <div className="mt-8 rounded-lg bg-ink p-6 text-porcelain">
            <CalendarDays className="text-champagne" />
            <h2 className="mt-4 font-display text-3xl font-semibold">Door-to-door only</h2>
            <p className="mt-3 text-sm leading-7 text-porcelain/72">
              For home appointments, include your address and notes so setup time and hygiene requirements are clear.
            </p>
          </div>
        </div>

        <form className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm sm:p-8" onSubmit={onSubmit}>
          {!token ? (
            <div className="mb-5 rounded-lg bg-pearl p-4 text-sm text-ink/75">
              Please <Link className="font-bold text-rosewood" to="/login">login or register</Link> before confirming your booking.
            </div>
          ) : null}
          <label className="field-label">Service</label>
          <select className="field-input" {...register("serviceId", { required: true })} disabled={servicesLoading || servicesError}>
            <option value="">{servicesLoading ? "Loading services..." : servicesError ? "Services unavailable" : "Select a service"}</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          {servicesError ? (
            <p className="mt-3 rounded-lg bg-rosewood/10 p-3 text-sm font-semibold text-rosewood">
              {axios.isAxiosError(servicesFetchError)
                ? servicesFetchError.response?.data?.message ?? "Services could not load. Confirm the frontend VITE_API_URL points to the Railway backend /api URL."
                : "Services could not load. Please try again."}
            </p>
          ) : null}
          <label className="field-label">Date</label>
          <input className="field-input" type="date" min={today} {...register("appointmentDate", { required: true })} />

          <div className="mt-5">
            <p className="field-label">Available slots</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {isFetching ? <p className="text-sm text-ink/60">Checking availability...</p> : null}
              {availabilityError ? <p className="text-sm font-semibold text-rosewood">Availability could not load. Please choose the service again or refresh.</p> : null}
              {!isFetching && serviceId && slots.length === 0 ? <p className="text-sm text-rosewood">No available slots for this date.</p> : null}
              {slots.map((slot) => (
                <label key={slot.startTime} className="cursor-pointer rounded-lg border border-ink/10 p-3 text-sm font-semibold has-[:checked]:border-rosewood has-[:checked]:bg-pearl">
                  <input className="sr-only" type="radio" value={slot.startTime} {...register("startTime", { required: true })} onChange={() => setValue("startTime", slot.startTime)} />
                  {slot.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Name</label>
              <input className="field-input" {...register("customerName", { required: true })} />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input className="field-input" {...register("customerPhone", { required: true })} />
            </div>
          </div>
          <label className="field-label">Email</label>
          <input className="field-input" type="email" {...register("customerEmail", { required: true })} />
          <label className="field-label">Home service address</label>
          <input className="field-input" {...register("address", { required: true })} />
          <label className="field-label">Notes</label>
          <textarea className="field-input min-h-28" {...register("notes")} placeholder="Occasion, hair type, child comfort needs, or hygiene notes" />
          {bookingMutation.isSuccess ? (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-sage/15 p-3 text-sm font-semibold text-sage">
              <CheckCircle2 size={18} /> Appointment request created.
            </p>
          ) : null}
          {bookingMutation.isError ? <p className="mt-4 rounded-lg bg-rosewood/10 p-3 text-sm font-semibold text-rosewood">That slot could not be booked. Please choose another time.</p> : null}
          <button className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-porcelain disabled:opacity-50" type="submit" disabled={!token || bookingMutation.isPending}>
            Confirm booking
          </button>
        </form>
      </section>
    </PageTransition>
  );
};
