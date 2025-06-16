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
        icon: "pi pi-sitemap",
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
        icon: "pi pi-sitemap",
        label: "Permission management",
        className: "text-gray-700",
        template: "",
        link: "/permission",
      },
    ],
  },
];
export type { BreadCrumbGroup, BreadCrumbItem };
export default data;
