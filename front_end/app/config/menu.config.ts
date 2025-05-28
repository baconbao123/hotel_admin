import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  CogIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import type { MenuItem } from '../types/menu.types';

export const navigation: MenuItem[] = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: HomeIcon 
  },
  { 
    name:  'Users management', 
    href: '/user', 
    icon: UserIcon 
  },
  { 
    name: 'Bookings', 
    href: '/bookings', 
    icon: CalendarIcon,
    children: [
      { name: 'All Bookings', href: '/bookings' },
      { name: 'New Booking', href: '/bookings/new' },
      { name: 'Calendar View', href: '/bookings/calendar' },
    ]
  },
  { 
    name: 'Rooms', 
    href: '/rooms', 
    icon: BuildingOfficeIcon,
    children: [
      { name: 'Room List', href: '/rooms' },
      { name: 'Room Types', href: '/rooms/types' },
      { name: 'Room Status', href: '/rooms/status' },
    ]
  },
  { 
    name: 'Customers', 
    href: '/customers', 
    icon: UsersIcon,
    children: [
      { name: 'All Customers', href: '/customers' },
      { name: 'VIP Customers', href: '/customers/vip' },
    ]
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: ClipboardDocumentListIcon 
  },
  { 
    name: 'Setting', 
    href: '/setting', 
    icon: CogIcon 
  },
];