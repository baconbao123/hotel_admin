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

export default function RoleDetail({
  id,
  open,
  mode = "view",
  onClose,
  loadDataById,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [createdData, setCreatedData] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedData, setUpdatedData] = useState("");
  const [updateAt, setUpdateAt] = useState("");

  const toast = useRef<Toast>(null);

  const header = mode === "view" ? "DETAILS" : "ADD";

  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then((data) => {
          setName(data.entity.name || "");
          setDescription(data.entity.description || "");
          setStatus(data.entity.status ?? true);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 pr-4">
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="name" className="font-bold col-span-1">
              Name:
            </label>
            <span id="name" className="col-span-2">
              {name || "-"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="description" className="font-bold col-span-1">
              Description:
            </label>
            <span id="description" className="col-span-2">
              {description || "-"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="status" className="font-bold col-span-1">
              Status:
            </label>
            <span id="status" className="col-span-2">
              <Tag
                value={status ? "Active" : "Inactive"}
                severity={status ? "success" : "danger"}
              />
            </span>
          </div>

          <div></div>
        </div>
        
        {/* Info data create/update */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-4 pr-4">
          {/* Left */}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="createdName" className="font-bold block mb-1">
                Created By:
              </label>
              <span id="createdName">{createdData || "-"}</span>
            </div>

            <div>
              <label htmlFor="createdAt" className="font-bold block mb-1">
                Created At:
              </label>
              <span id="createdAt">
                {createdAt
                  ? format(new Date(createdAt), "yyyy-MM-dd HH:mm:ss")
                  : "-"}
              </span>
            </div>
          </div>
          {/* Right */}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="updatedName" className="font-bold block mb-1">
                Updated By:
              </label>
              <span id="updatedName">{updatedData || "-"}</span>
            </div>

            <div>
              <label htmlFor="createdAt" className="font-bold block mb-1">
                Update At:
              </label>
              <span id="createdAt">
                {updateAt
                  ? format(new Date(updateAt), "yyyy-MM-dd HH:mm:ss")
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
