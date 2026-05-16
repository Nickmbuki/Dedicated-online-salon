export type UserRole = "customer" | "admin";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
};

export type ServiceCategory = "hair" | "nails" | "skincare" | "children" | "event" | "home";

export type Service = {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  priceCents?: number | null;
  durationMinutes: number;
  imageUrl: string;
  isActive: boolean;
  isDoorToDoor: boolean;
};

export type Slot = {
  startTime: string;
  endTime: string;
  label: string;
};

export type Booking = {
  id: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string | null;
  address?: string | null;
};
