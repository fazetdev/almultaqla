// Mock data for ALMULTAQLA Dashboard - Phase 1

export const staff = [
  { id: 1, name: "Ali", role: "Barber", languages: ["Arabic", "English"], color: "bg-blue-100 text-blue-800" },
  { id: 2, name: "Sarah", role: "Beautician", languages: ["Arabic", "Filipino"], color: "bg-pink-100 text-pink-800" },
  { id: 3, name: "Maria", role: "Therapist", languages: ["English", "Tagalog"], color: "bg-purple-100 text-purple-800" },
  { id: 4, name: "Fatima", role: "Stylist", languages: ["Arabic", "Urdu"], color: "bg-green-100 text-green-800" },
];

export const services = [
  { id: 1, name: "Haircut", duration: 45, price: 60, category: "Hair" },
  { id: 2, name: "Beard Trim", duration: 30, price: 40, category: "Grooming" },
  { id: 3, name: "Facial", duration: 60, price: 120, category: "Skincare" },
  { id: 4, name: "Massage", duration: 90, price: 180, category: "Spa" },
  { id: 5, name: "Manicure", duration: 45, price: 50, category: "Nails" },
  { id: 6, name: "Pedicure", duration: 60, price: 70, category: "Nails" },
  { id: 7, name: "Hair Color", duration: 120, price: 250, category: "Hair" },
  { id: 8, name: "Waxing", duration: 30, price: 40, category: "Skincare" },
];

export const appointments = [
  { id: 1, customerName: "Ahmed Al-Mansoor", phone: "+966 50 123 4567", service: "Haircut", staffId: 1, date: "2024-01-22", time: "10:00", duration: 45, status: "confirmed", amount: 60 },
  { id: 2, customerName: "Fatima Al-Khalifa", phone: "+966 55 234 5678", service: "Facial", staffId: 2, date: "2024-01-22", time: "11:00", duration: 60, status: "confirmed", amount: 120 },
  { id: 3, customerName: "Mohammed Al-Saud", phone: "+966 54 345 6789", service: "Beard Trim", staffId: 1, date: "2024-01-22", time: "14:00", duration: 30, status: "pending", amount: 40 },
  { id: 4, customerName: "Layla Al-Nahyan", phone: "+971 50 456 7890", service: "Massage", staffId: 3, date: "2024-01-22", time: "15:30", duration: 90, status: "confirmed", amount: 180 },
  { id: 5, customerName: "Omar Al-Qasimi", phone: "+971 55 567 8901", service: "Haircut", staffId: 1, date: "2024-01-22", time: "16:30", duration: 45, status: "overdue", amount: 60 },
  { id: 6, customerName: "Noura Al-Thani", phone: "+974 33 678 9012", service: "Manicure", staffId: 2, date: "2024-01-23", time: "09:30", duration: 45, status: "confirmed", amount: 50 },
  { id: 7, customerName: "Khalid Al-Farsi", phone: "+968 99 789 0123", service: "Pedicure", staffId: 4, date: "2024-01-23", time: "11:00", duration: 60, status: "pending", amount: 70 },
  { id: 8, customerName: "Hessa Al-Kuwari", phone: "+974 55 890 1234", service: "Hair Color", staffId: 4, date: "2024-01-23", time: "13:00", duration: 120, status: "confirmed", amount: 250 },
];

export const customers = [
  { id: 1, name: "Ahmed Al-Mansoor", phone: "+966 50 123 4567", email: "ahmed@example.com", totalSpent: 850, lastVisit: "2024-01-15", visitCount: 8, preferredStaff: "Ali" },
  { id: 2, name: "Fatima Al-Khalifa", phone: "+966 55 234 5678", email: "fatima@example.com", totalSpent: 1200, lastVisit: "2024-01-18", visitCount: 12, preferredStaff: "Sarah" },
  { id: 3, name: "Mohammed Al-Saud", phone: "+966 54 345 6789", email: "mohammed@example.com", totalSpent: 400, lastVisit: "2024-01-10", visitCount: 5, preferredStaff: "Ali" },
  { id: 4, name: "Layla Al-Nahyan", phone: "+971 50 456 7890", email: "layla@example.com", totalSpent: 2100, lastVisit: "2024-01-19", visitCount: 15, preferredStaff: "Maria" },
  { id: 5, name: "Omar Al-Qasimi", phone: "+971 55 567 8901", email: "omar@example.com", totalSpent: 300, lastVisit: "2024-01-05", visitCount: 3, preferredStaff: "Ali" },
  { id: 6, name: "Noura Al-Thani", phone: "+974 33 678 9012", email: "noura@example.com", totalSpent: 600, lastVisit: "2024-01-20", visitCount: 7, preferredStaff: "Sarah" },
  { id: 7, name: "Khalid Al-Farsi", phone: "+968 99 789 0123", email: "khalid@example.com", totalSpent: 950, lastVisit: "2024-01-12", visitCount: 9, preferredStaff: "Fatima" },
  { id: 8, name: "Hessa Al-Kuwari", phone: "+974 55 890 1234", email: "hessa@example.com", totalSpent: 1750, lastVisit: "2024-01-21", visitCount: 11, preferredStaff: "Maria" },
];

export const payments = [
  { id: 1, customerName: "Ahmed Al-Mansoor", date: "2024-01-15", service: "Haircut", amount: 60, status: "paid", method: "Cash" },
  { id: 2, customerName: "Fatima Al-Khalifa", date: "2024-01-18", service: "Facial", amount: 120, status: "paid", method: "Card" },
  { id: 3, customerName: "Mohammed Al-Saud", date: "2024-01-10", service: "Beard Trim", amount: 40, status: "pending", method: "Cash" },
  { id: 4, customerName: "Layla Al-Nahyan", date: "2024-01-19", service: "Massage", amount: 180, status: "paid", method: "Card" },
  { id: 5, customerName: "Omar Al-Qasimi", date: "2024-01-05", service: "Haircut", amount: 60, status: "overdue", method: "Cash" },
  { id: 6, customerName: "Noura Al-Thani", date: "2024-01-20", service: "Manicure", amount: 50, status: "paid", method: "Cash" },
  { id: 7, customerName: "Khalid Al-Farsi", date: "2024-01-12", service: "Pedicure", amount: 70, status: "pending", method: "Card" },
  { id: 8, customerName: "Hessa Al-Kuwari", date: "2024-01-21", service: "Hair Color", amount: 250, status: "paid", method: "Card" },
];

export const analyticsData = {
  weeklyRevenue: [3200, 2800, 3500, 4000, 3250, 3800, 4100],
  topServices: [
    { name: "Haircut", value: 28 },
    { name: "Facial", value: 22 },
    { name: "Massage", value: 18 },
    { name: "Hair Color", value: 15 },
    { name: "Manicure", value: 12 },
  ],
  peakHours: [
    { hour: "9 AM", bookings: 5 },
    { hour: "10 AM", bookings: 8 },
    { hour: "11 AM", bookings: 12 },
    { hour: "12 PM", bookings: 10 },
    { hour: "1 PM", bookings: 6 },
    { hour: "2 PM", bookings: 9 },
    { hour: "3 PM", bookings: 11 },
    { hour: "4 PM", bookings: 15 },
    { hour: "5 PM", bookings: 13 },
    { hour: "6 PM", bookings: 7 },
  ],
  staffPerformance: [
    { name: "Ali", appointments: 24, revenue: 1440 },
    { name: "Sarah", appointments: 18, revenue: 2160 },
    { name: "Maria", appointments: 15, revenue: 2700 },
    { name: "Fatima", appointments: 12, revenue: 1440 },
  ],
};

// Helper function to get staff name by ID
export const getStaffName = (id: number) => {
  return staff.find(s => s.id === id)?.name || "Unknown";
};

// Helper function to get service details
export const getServiceDetails = (serviceName: string) => {
  return services.find(s => s.name === serviceName);
};
