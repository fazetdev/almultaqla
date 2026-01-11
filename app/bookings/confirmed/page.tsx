// Bookings Confirmed Page
// Updated for SmartOps Gulf Dashboard

export default function ConfirmedPage() {
  return (
    <div className="confirmed-booking">
      <h1>Booking Confirmed</h1>
      <p>Your booking has been successfully confirmed.</p>
      <div className="booking-details">
        <p><strong>Location:</strong> SmartOps Gulf Dashboard</p>
        {/* Additional booking details will come from backend */}
      </div>
    </div>
  );
}
