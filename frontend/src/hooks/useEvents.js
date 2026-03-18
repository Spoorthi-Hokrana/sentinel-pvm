import { useState, useEffect } from 'react';

// Mock events for display
const mockEvents = [
  { type: 'verified', field: 'North Wheat', reading: 'Soil moisture', value: '67.2%', time: '2 min ago' },
  { type: 'verified', field: 'North Wheat', reading: 'Temperature', value: '24.1°C', time: '2 min ago' },
  { type: 'verified', field: 'South Corn', reading: 'pH Level', value: '6.84', time: '3 min ago' },
  { type: 'warning', field: 'Greenhouse A', reading: 'Moisture', value: '38.1%', time: '5 min ago' },
  { type: 'verified', field: 'East Orchard', reading: 'Irrigation', value: '12.5 L/m', time: '8 min ago' },
  { type: 'verified', field: 'West Barley', reading: 'Temperature', value: '22.8°C', time: '10 min ago' },
  { type: 'verified', field: 'South Corn', reading: 'Moisture', value: '71.3%', time: '12 min ago' },
  { type: 'verified', field: 'North Wheat', reading: 'Irrigation', value: '14.2 L/m', time: '15 min ago' },
];

export function useEvents() {
  const [events, setEvents] = useState(mockEvents);
  return { events, isLoading: false };
}