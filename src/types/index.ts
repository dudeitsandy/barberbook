export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'CUSTOMER' | 'BUSINESS' | 'ADMIN';
  businessId?: string;
}

export interface Booking {
  id: string;
  date: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  businessId: string;
  locationId: string;
  serviceId: string;
  employeeId: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  businessId: string;
  locationId?: string;
} 