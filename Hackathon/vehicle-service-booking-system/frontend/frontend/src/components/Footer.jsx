import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ color: '#ffffff', marginBottom: '1rem' }}>
              <span className="brand-icon">
                <Wrench size={20} />
              </span>
              <span>VehicleCare</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Next-generation Vehicle Service Booking &amp; Workshop Tracking platform. 
              Delivering transparent pricing, real-time lifecycle tracking, and verified OEM spare parts.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', color: '#93c5fd', fontSize: '0.85rem' }}>
              <span>24/7 Breakdown Assistance: 1800-456-7890</span>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Dashboard</Link></li>
              <li><Link to="/services">Service Packages</Link></li>
              <li><Link to="/book">Book Service Slot</Link></li>
              <li><Link to="/tracking">Real-time Tracker</Link></li>
              <li><Link to="/vehicles">Manage Vehicles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Service Hubs</h4>
            <ul className="footer-links">
              <li>Periodic Maintenance</li>
              <li>Engine Diagnostics</li>
              <li>Brake &amp; Suspension Overhaul</li>
              <li>AC Cooling &amp; Disinfection</li>
              <li>Wheel Balancing &amp; Tyres</li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Contact Workshop</h4>
            <ul className="footer-links" style={{ fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Plot 42, Workshop Central, Tech Zone, Hyderabad - 500081</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={16} />
                <span>+91 98765 00000</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={16} />
                <span>service@vehiclecare.com</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Clock size={16} />
                <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} VehicleCare Systems. College Project for Database Systems Engineering &amp; Distributed Backend Development.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

