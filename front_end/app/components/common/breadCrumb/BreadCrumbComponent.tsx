import { BreadCrumb } from "primereact/breadcrumb";
import data from "./index";
import type { BreadCrumbGroup, BreadCrumbItem } from "./index";
import { Link } from "react-router";

interface Props {
    readonly name: string;
}

export default function BreadCrumbComponent({ name }: Props) {
    const iconItemTemplate = (item: BreadCrumbItem) => {
        return (
            <div>
                <span className={item.icon}></span>{" "}
                <Link className="ms-2" to={item.link}> {item.label}</Link>
            </div>
        );
    };

    const handleItems = (): BreadCrumbItem[] => {
        let group = data.find((item: BreadCrumbGroup) => item.name === name);
        if (!group || group.data.length === 0) {
            return [];
        }

        group.data.forEach((item: BreadCrumbItem) => {
            item.template = iconItemTemplate;
        });

        return group.data;
    };

    return (
        <div>
            <BreadCrumb model={handleItems()} />
        </div>
    );
}
