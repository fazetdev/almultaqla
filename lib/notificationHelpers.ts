import { useNotifications } from '../context/useNotifications';

// This is a helper hook to use notifications
export const useBookingNotifications = () => {
  const { addNotification } = useNotifications();

  const sendBookingNotification = (bookingData: any) => {
    addNotification({
      type: 'booking',
      title: 'New Booking',
      message: `${bookingData.customerName} booked ${bookingData.service} for ${bookingData.date} at ${bookingData.time}`,
      data: bookingData,
    });
  };

  const sendPaymentNotification = (paymentData: any) => {
    addNotification({
      type: 'payment',
      title: 'Payment Received',
      message: `${paymentData.customerName} paid ${paymentData.amount} AED for ${paymentData.service}`,
      data: paymentData,
    });
  };

  const sendReminderNotification = (reminderData: any) => {
    addNotification({
      type: 'reminder',
      title: 'Appointment Reminder',
      message: `${reminderData.customerName} has an appointment in ${reminderData.timeRemaining}`,
      data: reminderData,
    });
  };

  return {
    sendBookingNotification,
    sendPaymentNotification,
    sendReminderNotification,
  };
};
