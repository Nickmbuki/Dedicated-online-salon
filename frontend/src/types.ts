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
  userId?: string;
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

export type BookingWithService = {
  booking: Booking;
  service: Service;
};

export type SupportMessage = {
  id: string;
  threadId: string;
  senderRole: "customer" | "admin" | "bot";
  senderName: string;
  message: string;
  createdAt: string;
};

export type SupportThread = {
  thread: {
    id: string;
    userId?: string | null;
    subject: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    source: "customer_message" | "chatbot" | "contact_form" | "booking";
    status: "open" | "closed";
    lastMessageAt: string;
    createdAt: string;
    updatedAt: string;
  };
  messages: SupportMessage[];
};
