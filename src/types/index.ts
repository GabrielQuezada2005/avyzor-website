export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  service?: string;
  source?: string;
  status?: string;
  created_at?: string;
}

export interface QuoteRequest {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  timeline?: string;
  description?: string;
  status?: string;
  created_at?: string;
}

export interface Booking {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  service?: string;
  notes?: string;
  status?: string;
  created_at?: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  subscribed_at?: string;
  active?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service?: string;
}

export interface QuoteFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  timeline?: string;
  description?: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  service?: string;
  notes?: string;
}
