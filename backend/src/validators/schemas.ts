import { z } from 'zod';

// Auth Validators
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// School Validators
export const CreateSchoolSchema = z.object({
  name: z.string().min(3, 'School name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(3, 'Zip code is required'),
  country: z.string().min(2, 'Country is required'),
  registrationNumber: z.string().min(3, 'Registration number is required'),
  principalName: z.string().min(3, 'Principal name is required'),
  established: z.string().datetime(),
  website: z.string().url().optional(),
  logo: z.string().optional(),
});

export const UpdateSchoolSchema = CreateSchoolSchema.partial();

// User Validators
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'ACCOUNTANT', 'RECEPTIONIST', 'PARENT', 'STUDENT']),
});

export const UpdateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
});

// Student Validators
export const CreateStudentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  enrollmentNumber: z.string().min(3),
  dateOfBirth: z.string().datetime(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  classId: z.string().min(1),
  sectionId: z.string().min(1),
});

export const UpdateStudentSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  classId: z.string().optional(),
  sectionId: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  bloodGroup: z.string().optional(),
});

// Class Validators
export const CreateClassSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  description: z.string().optional(),
});

// Section Validators
export const CreateSectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  classId: z.string().min(1, 'Class ID is required'),
  capacity: z.number().int().positive('Capacity must be positive'),
});

// Attendance Validators
export const CreateAttendanceSchema = z.object({
  studentId: z.string(),
  sectionId: z.string(),
  date: z.string().datetime(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'LEAVE']),
  remarks: z.string().optional(),
});

// Fee Validators
export const CreateFeeSchema = z.object({
  classId: z.string(),
  feeType: z.string().min(1),
  amount: z.number().positive(),
  dueDate: z.string().datetime(),
  description: z.string().optional(),
});

export const CreateFeePaymentSchema = z.object({
  studentId: z.string(),
  feeId: z.string(),
  amount: z.number().positive(),
  paymentMethod: z.string(),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

// Exam Validators
export const CreateExamSchema = z.object({
  classId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

// Marks Validators
export const CreateMarksSchema = z.object({
  studentId: z.string(),
  teacherId: z.string(),
  examId: z.string(),
  subject: z.string().min(1),
  obtainedMarks: z.number().nonnegative(),
  totalMarks: z.number().positive(),
  remarks: z.string().optional(),
});
