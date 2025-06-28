import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { format } from "date-fns";
import $axios from "@/axios";

interface Props {
  id?: string;
  open: boolean;
  mode?: "create" | "edit" | "view";
  onClose: () => void;
  loadDataById: (id: string) => Promise<any>;
}

export default function FacilityDetail({
  id,
  open,
  mode = "view",
  onClose,
  loadDataById,
}: Props) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [typeName, setTypeName] = useState("");
  const [createdData, setCreatedData] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedData, setUpdatedData] = useState("");
  const [updateAt, setUpdateAt] = useState("");

  const [typeData, setTypeData] = useState<any[]>([]);
  const toast = useRef<Toast>(null);

  const header = "FACILITY DETAILS";

  // Load danh sách types để mapping hiển thị type name
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await $axios.get("/hotel-facilities/facilities-type");
        setTypeData(res.data.result || []);
      } catch (err: any) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: err.response?.data?.message || "Failed to load types",
          life: 3000,
        });
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then((data) => {
          setName(data.entity.name || "");
          setIcon(data.entity.icon || "");
          const typeId =
            typeof data.entity.type === "object"
              ? data.entity.type.id
              : data.entity.type;
          const matchedType = typeData.find((t) => t.id === typeId);
          setTypeName(matchedType?.name || "-");

          setCreatedAt(data.entity.createdAt || "");
          setUpdateAt(data.entity.updatedAt || "");
          setCreatedData(data.createdName || "");
          setUpdatedData(data.updatedName || "");
        })
        .catch(() =>
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to load facility",
            life: 3000,
          })
        );
    }
  }, [id, open, loadDataById, typeData]);

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={open}
        onHide={onClose}
        header={header}
        footer={
          <div className="flex justify-center gap-2">
            <Button
              outlined
              label="Close"
              onClick={onClose}
              severity="secondary"
              style={{ padding: "8px 40px" }}
            />
          </div>
        }
        style={{ width: "40%" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Name */}
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label className="font-bold col-span-1">Name:</label>
            <span className="col-span-2">{name || "-"}</span>
          </div>

          {/* Icon */}
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <span className="col-span-2 flex items-center gap-2">
              <label className="font-bold col-span-1">Icon:</label>
              {icon && <i className={`${icon} text-xl`} />}
            </span>
          </div>

          {/* Type */}
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label className="font-bold col-span-1">Type:</label>
            <span className="col-span-2">{typeName || "-"}</span>
          </div>

          <div></div>

          {/* Created By */}
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label className="font-bold col-span-1">Created By:</label>
            <span className="col-span-2">{createdData || "-"}</span>
          </div>

          {/* Updated By */}
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label className="font-bold col-span-1">Updated By:</label>
            <span className="col-span-2">{updatedData || "-"}</span>
          </div>

          {/* Created At */}
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label className="font-bold col-span-1">Created At:</label>
            <span className="col-span-2">
              {createdAt
                ? format(new Date(createdAt), "yyyy-MM-dd HH:mm:ss")
                : "-"}
            </span>
          </div>

          {/* Updated At */}
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label className="font-bold col-span-1">Updated At:</label>
            <span className="col-span-2">
              {updateAt
                ? format(new Date(updateAt), "yyyy-MM-dd HH:mm:ss")
                : "-"}
            </span>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
