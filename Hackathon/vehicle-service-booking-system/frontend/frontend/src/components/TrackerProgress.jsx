import React from 'react';
import { Check, Clock, Wrench, ShieldCheck, XCircle } from 'lucide-react';

const TrackerProgress = ({ status }) => {
  const steps = [
    { key: 'BOOKED', label: '1. Booked', icon: <Clock size={16} /> },
    { key: 'CONFIRMED', label: '2. Confirmed & Assigned', icon: <ShieldCheck size={16} /> },
    { key: 'IN_PROGRESS', label: '3. In Progress', icon: <Wrench size={16} /> },
    { key: 'COMPLETED', label: '4. Service Completed', icon: <Check size={16} /> }
  ];

  if (status === 'CANCELLED') {
    return (
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '10px',
        padding: '1.25rem',
        textAlign: 'center',
        color: '#991b1b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        margin: '1.5rem 0'
      }}>
        <XCircle size={24} />
        <div>
          <strong style={{ fontSize: '1.1rem', display: 'block' }}>Service Appointment Cancelled</strong>
          <span style={{ fontSize: '0.875rem' }}>This booking has been cancelled and is no longer being serviced.</span>
        </div>
      </div>
    );
  }

  const stepOrder = ['BOOKED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'];
  const currentIndex = stepOrder.indexOf(status);

  return (
    <div className="tracker-container">
      <div className="steps-bar">
        {steps.map((step, idx) => {
          const isCompleted = currentIndex > idx;
          const isActive = currentIndex === idx;

          let itemClass = 'step-item';
          if (isCompleted) itemClass += ' completed';
          if (isActive) itemClass += ' active';

          return (
            <div key={step.key} className={itemClass}>
              <div className="step-circle">
                {isCompleted ? <Check size={18} /> : step.icon}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackerProgress;

