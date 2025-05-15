import { useBooking } from '@/hooks/useBooking'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  employeeId: z.string().min(1, 'Please select a staff member'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: