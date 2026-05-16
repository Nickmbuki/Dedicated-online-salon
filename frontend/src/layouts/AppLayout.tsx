import { Link, NavLink, Outlet } from "react-router-dom";
import { CalendarCheck, Menu, Sparkles, UserCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { InstallPrompt } from "../components/InstallPrompt";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Book", to: "/book" },
  { label: "Contact", to: "/contact" }
];

export const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const { token, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-porcelain text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-porcelain/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link className="flex items-center gap-3" to="/">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-champagne">
              <Sparkles size={20} />
            </span>
            <span>
              <span className="block font-display text-2xl font-semibold leading-none">Elegant Beauty</span>
              <span className="block text-xs uppercase tracking-[0.22em] text-ink/60">Style Suite</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive ? "text-rosewood" : "text-ink/70 hover:text-ink"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {token ? (
              <>
                <Link className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold" to="/dashboard">
                  <UserCircle size={17} />
                  {user?.role === "admin" ? "Admin" : "Dashboard"}
                </Link>
                <button className="text-sm font-semibold text-ink/60 hover:text-ink" type="button" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-porcelain" to="/login">
                <CalendarCheck size={17} />
                Login
              </Link>
            )}
          </div>

          <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 lg:hidden" type="button" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>

        {open ? (
          <nav className="border-t border-ink/10 px-5 py-4 lg:hidden">
            <div className="grid gap-3">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className="rounded-md px-2 py-2 text-sm font-semibold" onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
              <NavLink to={token ? "/dashboard" : "/login"} className="rounded-md bg-ink px-3 py-3 text-center text-sm font-semibold text-porcelain" onClick={() => setOpen(false)}>
                {token ? "Dashboard" : "Login"}
              </NavLink>
            </div>
          </nav>
        ) : null}
      </header>

      <Outlet />

      <footer className="bg-ink px-5 py-12 text-porcelain">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl font-semibold">Elegant Beauty Style Suite</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-porcelain/72">
              Online booking for door-to-door salon preparation: weddings, interviews, special events, children, and everyday confidence.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-champagne">Contact</p>
            <p className="mt-3 text-sm text-porcelain/75">0726432210</p>
            <p className="text-sm text-porcelain/75">0108501768</p>
            <p className="text-sm text-porcelain/75">lydiahm214@gmail.com</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-champagne">Care</p>
            <p className="mt-3 text-sm leading-7 text-porcelain/75">Door-to-door services, gentle children's handling, and refined hygiene standards.</p>
          </div>
        </div>
      </footer>
      <InstallPrompt />
    </div>
  );
};
