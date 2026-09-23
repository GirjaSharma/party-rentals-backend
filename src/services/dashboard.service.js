import { bookings } from "../data/bookings.js";
import { payments } from "../data/payments.js";
import { inventoryItems } from "../data/inventory.js";

const parseDateOnly = (dateString) => {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const isSameMonthYear = (date, month, year) => {
  return date.getMonth() === month && date.getFullYear() === year;
};

const getPercentageTrend = (previousValue, currentValue) => {
  if (previousValue === 0 && currentValue === 0) {
    return {
      value: 0,
      direction: "neutral",
    };
  }

  if (previousValue === 0) {
    return {
      value: 100,
      direction: "up",
    };
  }

  const percentage = ((currentValue - previousValue) / previousValue) * 100;

  return {
    value: Math.abs(Math.round(percentage)),
    direction: percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral",
  };
};

export const getDashboardSummaryData = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);
  lastDayOfCurrentMonth.setHours(0, 0, 0, 0);

  const previousMonth = currentMonth - 1;
  const previousMonthStartDate = new Date(currentYear, previousMonth, 1);
  previousMonthStartDate.setHours(0, 0, 0, 0);

  const previousMonthEndDate = new Date(currentYear, currentMonth, 0);
  previousMonthEndDate.setHours(0, 0, 0, 0);

  const upcomingEventsCurrentMonth = bookings.filter((booking) => {
    const eventDate = parseDateOnly(booking.eventDate);

    return (
      eventDate &&
      eventDate >= today &&
      eventDate <= lastDayOfCurrentMonth &&
      booking.bookingStatus === "confirmed"
    );
  });

  const upcomingEventsPreviousMonth = bookings.filter((booking) => {
    const eventDate = parseDateOnly(booking.eventDate);

    return (
      eventDate &&
      eventDate >= previousMonthStartDate &&
      eventDate <= previousMonthEndDate &&
      booking.bookingStatus === "confirmed"
    );
  });

  const revenueThisMonth = payments
    .filter((payment) => {
      const paidDate = parseDateOnly(payment.paidDate);

      return (
        payment.status === "paid" &&
        paidDate &&
        isSameMonthYear(paidDate, currentMonth, currentYear)
      );
    })
    .reduce((total, payment) => total + payment.amount, 0);

  const revenueLastMonth = payments
    .filter((payment) => {
      const paidDate = parseDateOnly(payment.paidDate);

      return (
        payment.status === "paid" &&
        paidDate &&
        paidDate.getMonth() === previousMonth &&
        paidDate.getFullYear() === currentYear
      );
    })
    .reduce((total, payment) => total + payment.amount, 0);

  const outstandingPayments = payments.filter((payment) => {
    const dueDate = parseDateOnly(payment.dueDate);

    return (
      payment.status === "pending" &&
      dueDate &&
      isSameMonthYear(dueDate, currentMonth, currentYear)
    );
  });

  const totalOutstandingPayments = outstandingPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const inventoryAlerts = inventoryItems.filter((item) => {
    const isLowStock = item.availableQuantity <= item.reorderPoint;
    const isUnavailable = item.status !== "available";
    const needsAttention = ["damaged", "maintenance", "poor"].includes(
      item.condition
    );

    return isLowStock || isUnavailable || needsAttention;
  });

  return {
    period: {
      month: currentMonth + 1,
      year: currentYear,
    },
    upcomingEvents: {
      value: upcomingEventsCurrentMonth.length,
      subtitle: "Remaining this month",
      trend: getPercentageTrend(
        upcomingEventsPreviousMonth.length,
        upcomingEventsCurrentMonth.length
      ),
    },
    revenueThisMonth: {
      value: revenueThisMonth,
      subtitle: "vs last month",
      trend: getPercentageTrend(revenueLastMonth, revenueThisMonth),
    },
    outstandingPayments: {
      value: totalOutstandingPayments,
      invoiceCount: outstandingPayments.length,
    },
    inventoryAlerts: {
      value: inventoryAlerts.length,
      subtitle: "items low or out",
    },
  };
};