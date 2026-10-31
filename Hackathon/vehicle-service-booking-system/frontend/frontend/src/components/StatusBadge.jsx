import React from 'react';
import { Clock, CheckCircle2, AlertCircle, PlayCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  const getBadgeDetails = () => {
    switch (normalized) {
      case 'BOOKED':
        return {
          label: 'Booked',
          className: 'badge badge-booked',
          icon: <Clock size={12} />
        };
      case 'CONFIRMED':
        return {
          label: 'Confirmed',
          className: 'badge badge-confirmed',
          icon: <CheckCircle2 size={12} />
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          className: 'badge badge-in_progress',
          icon: <PlayCircle size={12} />
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          className: 'badge badge-completed',
          icon: <CheckCircle2 size={12} />
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className: 'badge badge-cancelled',
          icon: <XCircle size={12} />
        };
      case 'PAID':
        return {
          label: 'Paid',
          className: 'badge badge-paid',
          icon: <CheckCircle2 size={12} />
        };
      case 'PENDING':
        return {
          label: 'Pending',
          className: 'badge badge-pending',
          icon: <AlertCircle size={12} />
        };
      default:
        return {
          label: normalized,
          className: 'badge badge-booked',
          icon: null
        };
    }
  };

  const { label, className, icon } = getBadgeDetails();

  return (
    <span className={className}>
      {icon}
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;

