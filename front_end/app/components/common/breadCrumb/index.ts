interface BreadCrumbItem {
  icon: string;
  label: string;
  className?: string;
  template?: any;
  link: string;
}

interface BreadCrumbGroup {
  name: string;
  data: BreadCrumbItem[];
}

const data: BreadCrumbGroup[] = [
  {
    name: "UserList",
    data: [
      {
        icon: "pi pi-home",
        label: " Home page",
        className: "text-gray-700",
        template: "",
        link: "/",
      },
      {
        icon: "pi pi-users",
        label: "Users management",
        className: "text-gray-700",
        template: "",
        link: "/user",
      },
    ],
  },
  {
    name: "RoleList",
    data: [
      {
        icon: "pi pi-home",
        label: " Home page",
        className: "text-gray-700",
        template: "",
        link: "/",
      },
      {
        icon: "pi pi-sitemap",
        label: "Role management",
        className: "text-gray-700",
        template: "",
        link: "/role",
      },
    ],
  },
  {
    name: "PermissionList",
    data: [
      {
        icon: "pi pi-home",
        label: " Home page",
        className: "text-gray-700",
        template: "",
        link: "/",
      },
      {
        icon: "pi pi-shield",
        label: "Permission Management",
        className: "text-gray-700",
        template: "",
        link: "/permission",
      },
    ],
  },
  {
    name: "StreetList",
    data: [
      {
        icon: "pi pi-home",
        label: " Home page",
        className: "text-gray-700",
        template: "",
        link: "/",
      },
      {
        icon: "pi pi-map",
        label: "Street Management",
        className: "text-gray-700",
        template: "",
        link: "/street",
      },
    ],
  },
  {
    name: "HotelList",
    data: [
      {
        icon: "pi pi-home",
        label: " Home page",
        className: "text-gray-700",
        template: "",
        link: "/",
      },
      {
        icon: "pi pi-building",
        label: "Hotel Management",
        className: "text-gray-700",
        template: "",
        link: "/hotels",
      },
    ],
  },
  {
    name: "FacilityList",
    data: [
      {
        icon: "pi pi-home",
        label: " Home page",
        className: "text-gray-700",
        template: "",
        link: "/",
      },
      {
        icon: "pi pi-tag",
        label: "Facilities List",
        className: "text-gray-700",
        template: "",
        link: "/facilities",
      },
    ],
  },
];
export type { BreadCrumbGroup, BreadCrumbItem };
export default data;
