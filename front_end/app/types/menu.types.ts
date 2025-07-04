import type { ComponentType, SVGProps } from "react";

export interface MenuItem {
  name: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  resourceName?: string;
  children?: MenuItem[];
}
