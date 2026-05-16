import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Pencil, X } from "lucide-react";
import { cancelBooking, fetchBookings, fetchServices, updateBooking } from "../api/services";
import { useAuth } from "../context/AuthContext";

type BookingEditForm = {
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  notes: string;
  address: string;
};

export const BookingManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["bookings"], queryFn: fetchBookings });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const selectedBooking = useMemo(
    () => bookings.find((item) => item.booking.id === selectedBookingId) ?? null,
    [bookings, selectedBookingId]
  );

  const { register, handleSubmit, reset } = useForm<BookingEditForm>();

  useEffect(() => {
    if (selectedBooking) {
      reset({
        serviceId: selectedBooking.booking.serviceId,
        appointmentDate: selectedBooking.booking.appointmentDate,
        startTime: selectedBooking.booking.startTime.slice(0, 5),
        notes: selectedBooking.booking.notes ?? "",
        address: selectedBooking.booking.address ?? ""
      });
    }
  }, [reset, selectedBooking]);

  const updateMutation = useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: string; payload: BookingEditForm }) =>
      updateBooking(bookingId, {
        serviceId: payload.serviceId,
        appointmentDate: payload.appointmentDate,
        startTime: payload.startTime,
        notes: payload.notes,
        address: payload.address
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setSelectedBookingId(null);
    }
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setSelectedBookingId(null);
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedBooking) {
      return;
    }
    await updateMutation.mutateAsync({ bookingId: selectedBooking.booking.id, payload: values });
  });

  return (
    <section className="mt-10 overflow-hidden rounded-lg border border-rosewood/15 bg-white shadow-sm">
      <div className="border-b border-rosewood/10 px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rosewood">{user?.role === "admin" ? "Bookings" : "Your bookings"}</p>
        <h2 className="font-display text-3xl font-semibold">Booking tab</h2>
      </div>

      <div className="grid lg:grid-cols-[1fr_0.95fr]">
        <div className="border-b border-rosewood/10 lg:border-b-0 lg:border-r">
          <div className="max-h-[30rem] overflow-auto divide-y divide-rosewood/10">
            {isLoading ? <p className="p-5 text-sm text-ink/60">Loading bookings...</p> : null}
            {bookings.map(({ booking, service }) => (
              <article key={booking.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CalendarClock size={16} className="text-rosewood" />
                      <p className="font-semibold">{service.name}</p>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">{booking.appointmentDate} · {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}</p>
                    <p className="mt-1 text-sm text-ink/60">{booking.customerName} · {booking.customerPhone}</p>
                  </div>
                  <span className="rounded-full bg-pearl px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-rosewood">
                    {booking.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold" type="button" onClick={() => setSelectedBookingId(booking.id)}>
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-rosewood/20 px-4 py-2 text-sm font-semibold text-rosewood"
                    type="button"
                    onClick={() => cancelMutation.mutate(booking.id)}
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </article>
            ))}
            {!isLoading && bookings.length === 0 ? <p className="p-5 text-sm text-ink/60">No bookings yet.</p> : null}
          </div>
        </div>

        <div className="p-5">
          {selectedBooking ? (
            <form className="grid gap-4" onSubmit={onSubmit}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rosewood">Edit booking</p>
                <h3 className="mt-2 font-display text-2xl font-semibold">{selectedBooking.service.name}</h3>
              </div>
              <label className="field-label">Service</label>
              <select className="field-input" {...register("serviceId", { required: true })}>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <label className="field-label">Date</label>
              <input className="field-input" type="date" {...register("appointmentDate", { required: true })} />
              <label className="field-label">Time</label>
              <input className="field-input" type="time" step={900} {...register("startTime", { required: true })} />
              <label className="field-label">Address</label>
              <input className="field-input" {...register("address")} />
              <label className="field-label">Notes</label>
              <textarea className="field-input min-h-28" {...register("notes")} />
              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save changes"}
                </button>
                <button className="rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold" type="button" onClick={() => setSelectedBookingId(null)}>
                  Close
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-lg bg-pink-50 p-5 text-sm leading-7 text-ink/70">
              Select a booking to edit details. Cancel buttons remove a booking from your active list immediately.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
