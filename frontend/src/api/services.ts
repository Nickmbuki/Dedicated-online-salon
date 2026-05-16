import { api } from "./client";
import type { Booking, BookingWithService, Service, Slot, SupportThread, User } from "../types";

export const fetchServices = async () => {
  const { data } = await api.get<{ services: Service[] }>("/services");
  return data.services;
};

export const fetchAdminServices = async () => {
  const { data } = await api.get<{ services: Service[] }>("/services/admin");
  return data.services;
};

export const createService = async (payload: {
  name: string;
  slug: string;
  category: Service["category"];
  description: string;
  priceCents?: number | null;
  durationMinutes: number;
  imageUrl: string;
  isActive: boolean;
  isDoorToDoor: boolean;
}) => {
  const { data } = await api.post<{ service: Service }>("/services", payload);
  return data.service;
};

export const updateService = async ({ id, ...payload }: Partial<Service> & { id: string }) => {
  const { data } = await api.put<{ service: Service }>(`/services/${id}`, payload);
  return data.service;
};

export const fetchAvailability = async (serviceId: string, date: string) => {
  const { data } = await api.get<{ slots: Slot[] }>("/bookings/availability", {
    params: { serviceId, date }
  });
  return data.slots;
};

export const createBooking = async (payload: {
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  address?: string;
}) => {
  const { data } = await api.post<{ booking: Booking }>("/bookings", payload);
  return data.booking;
};

export const createGuestBooking = async (payload: {
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  password: string;
  notes?: string;
  address?: string;
}) => {
  const { data } = await api.post<{ booking: Booking; service: Service; user: User; token: string }>("/bookings/guest", payload);
  return data;
};

export const updateBooking = async (bookingId: string, payload: {
  serviceId?: string;
  appointmentDate?: string;
  startTime?: string;
  notes?: string | null;
  address?: string | null;
}) => {
  const { data } = await api.patch<{ booking: BookingWithService }>(`/bookings/${bookingId}`, payload);
  return data.booking;
};

export const cancelBooking = async (bookingId: string) => {
  const { data } = await api.delete<{ booking: Booking }>(`/bookings/${bookingId}`);
  return data.booking;
};

export const fetchBookings = async () => {
  const { data } = await api.get<{ bookings: BookingWithService[] }>("/bookings");
  return data.bookings;
};

export const loginRequest = async (payload: { email: string; password: string }) => {
  const { data } = await api.post<{ user: User; token: string }>("/auth/login", payload);
  return data;
};

export const registerRequest = async (payload: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}) => {
  const { data } = await api.post<{ user: User; token: string }>("/auth/register", payload);
  return data;
};

export const forgotPasswordRequest = async (payload: { email: string }) => {
  const { data } = await api.post<{ message: string; resetToken?: string }>("/auth/forgot-password", payload);
  return data;
};

export const resetPasswordRequest = async (payload: { token: string; password: string }) => {
  const { data } = await api.post<{ user: User; token: string }>("/auth/reset-password", payload);
  return data;
};

export const fetchMe = async () => {
  const { data } = await api.get<{ user: User }>("/auth/me");
  return data.user;
};

export const fetchSupportThreads = async () => {
  const { data } = await api.get<{ threads: SupportThread[] }>("/support/threads");
  return data.threads;
};

export const fetchSupportInbox = async () => {
  const { data } = await api.get<{ threads: SupportThread[] }>("/support/inbox");
  return data.threads;
};

export const fetchSupportThread = async (threadId: string) => {
  const { data } = await api.get<SupportThread>(`/support/threads/${threadId}`);
  return data;
};

export const createSupportThread = async (payload: { subject: string; message: string }) => {
  const { data } = await api.post<SupportThread>("/support/threads", payload);
  return data;
};

export const replySupportThread = async (threadId: string, payload: { message: string }) => {
  const { data } = await api.post<{ message: { id: string } }>(`/support/threads/${threadId}/messages`, payload);
  return data.message;
};

export const submitGuestInquiry = async (payload: {
  subject: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  source: "customer_message" | "chatbot" | "contact_form" | "booking";
}) => {
  const { data } = await api.post<SupportThread>("/support/guest", payload);
  return data;
};
