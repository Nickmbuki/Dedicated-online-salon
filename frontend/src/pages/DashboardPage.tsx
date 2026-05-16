import { useQuery } from "@tanstack/react-query";
import { CalendarClock, Crown, LogOut, UserRound } from "lucide-react";
import { fetchBookings } from "../api/services";
import { PageTransition } from "../components/PageTransition";
import { AdminServicesManager } from "../components/AdminServicesManager";
import { useAuth } from "../context/AuthContext";

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["bookings"], queryFn: fetchBookings });

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rosewood">{user?.role === "admin" ? "Admin dashboard" : "Customer dashboard"}</p>
            <h1 className="mt-3 font-display text-5xl font-semibold">Welcome, {user?.fullName}</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-bold" type="button" onClick={logout}>
            <LogOut size={17} /> Logout
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-lg bg-ink p-6 text-porcelain">
            <UserRound className="text-champagne" />
            <p className="mt-4 text-sm text-porcelain/65">Account</p>
            <p className="font-semibold">{user?.email}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-6">
            <CalendarClock className="text-rosewood" />
            <p className="mt-4 text-sm text-ink/60">Appointments</p>
            <p className="font-display text-4xl font-semibold">{bookings.length}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-6">
            <Crown className="text-champagne" />
            <p className="mt-4 text-sm text-ink/60">Role</p>
            <p className="font-semibold capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
          <div className="border-b border-ink/10 p-5">
            <h2 className="font-display text-3xl font-semibold">{user?.role === "admin" ? "All bookings" : "Your bookings"}</h2>
          </div>
          {isLoading ? <p className="p-5 text-sm text-ink/60">Loading bookings...</p> : null}
          <div className="divide-y divide-ink/10">
            {bookings.map(({ booking, service }) => (
              <article key={booking.id} className="grid gap-3 p-5 md:grid-cols-[1.2fr_1fr_0.7fr]">
                <div>
                  <p className="font-semibold">{service.name}</p>
                  <p className="mt-1 text-sm text-ink/60">{booking.customerName} · {booking.customerPhone}</p>
                </div>
                <p className="text-sm font-semibold text-ink/70">{booking.appointmentDate} · {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}</p>
                <span className="w-fit rounded-full bg-pearl px-3 py-1 text-xs font-bold capitalize text-rosewood">{booking.status}</span>
              </article>
            ))}
            {!isLoading && bookings.length === 0 ? <p className="p-5 text-sm text-ink/60">No bookings yet.</p> : null}
          </div>
        </div>

        {user?.role === "admin" ? <AdminServicesManager /> : null}
      </section>
    </PageTransition>
  );
};
