import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { format } from "date-fns";

interface Props {
  id?: string;
  open: boolean;
  mode?: "create" | "edit" | "view";
  onClose: () => void;
  loadDataById: (id: string) => Promise<any>;
}

export default function StreetDetail({
  id,
  open,
  mode = "view",
  onClose,
  loadDataById,
}: Props) {
  const [name, setName] = useState("");
  const [curb, setCurb] = useState("");
  const [width, setWidth] = useState(true);
  const [createdData, setCreatedData] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedData, setUpdatedData] = useState("");
  const [updateAt, setUpdateAt] = useState("");

  const toast = useRef<Toast>(null);

  const header = mode === "view" ? "ROLE DETAILS" : "ADD NEW ROLE";

  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then((data) => {
          setName(data.entity.name || "");
          setWidth(data.entity.width || "");
          setCurb(data.entity.curbWith || "");
          setCreatedAt(data.entity.createdAt || "");
          setUpdateAt(data.entity.updatedAt || "");
          setCreatedData(data.createdName || "");
          setUpdatedData(data.updatedName || "");
        })
        .catch(() =>
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to load role",
            life: 3000,
          })
        );
    }
  }, [id, open, loadDataById]);

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
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="name" className="font-bold col-span-1">
              Name:
            </label>
            <span id="name" className="col-span-2">
              {name || "-"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="width" className="font-bold col-span-1">
              Width:
            </label>
            <span id="width" className="col-span-2">
              {width || "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="curb" className="font-bold col-span-1">
              Curb width:
            </label>
            <span id="curb" className="col-span-2">
              {curb || "-"}
            </span>
          </div>

          <div></div>

          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="createdName" className="font-bold col-span-1">
              Created By:
            </label>
            <span id="createdName" className="col-span-2">
              {createdData || "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="updatedName" className="font-bold col-span-1">
              Updated By:
            </label>
            <span id="updatedName" className="col-span-2">
              {updatedData || "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="createdAt" className="font-bold col-span-1">
              Created At:
            </label>
            <span id="createdAt" className="col-span-2">
              {createdAt
                ? format(new Date(createdAt), "yyyy-MM-dd HH:mm:ss")
                : "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="updatedAt" className="font-bold col-span-1">
              Updated At:
            </label>
            <span id="updatedAt" className="col-span-2">
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
