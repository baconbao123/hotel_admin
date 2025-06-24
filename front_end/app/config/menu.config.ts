import {
  HomeIcon,
  CogIcon,
  BuildingOffice2Icon,
  UserIcon,
  RectangleGroupIcon,
  IdentificationIcon,
  MapIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import type { MenuItem } from "../types/menu.types";

export const navigation: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Users management",
    href: "/user",
    icon: UserIcon,
  },
  {
    name: "Role management",
    href: "/role",
    icon: IdentificationIcon,
  },
  {
    name: "Permission management",
    href: "/permission",
    icon: RectangleGroupIcon,
  },
  {
    name: "Street management",
    href: "/streets",
    icon: MapIcon,
  },
   {
    name: "Hotel facilities",
    href: "/facilities",
    icon: TagIcon,
  },
  {
    name: "Hotel",
    href: "/hotels",
    icon: BuildingOffice2Icon,
    children: [
      { name: "All Bookings", href: "/bookings" },
      { name: "New Booking", href: "/bookings/new" },
      { name: "Calendar View", href: "/bookings/calendar" },
    ],
  },
  {
    name: "Setting",
    href: "/setting",
    icon: CogIcon,
  },
 
];
