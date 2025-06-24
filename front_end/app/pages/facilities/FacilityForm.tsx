import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import $axios from "@/axios";

interface Props {
  id?: string;
  open: boolean;
  mode?: "create" | "edit" | "view";
  onClose: () => void;
  loadDataById: (id: string) => Promise<any>;
  createItem: (data: object | FormData) => Promise<any>;
  updateItem: (id: string, data: object | FormData) => Promise<any>;
  error: Object | null;
}

export default function FacilityForm({
  id,
  open,
  mode,
  onClose,
  loadDataById,
  createItem,
  updateItem,
  error,
}: Props) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState<any>(null);
  const [typeData, setTypeData] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const toast = useRef<Toast>(null);
  const header = mode === "edit" ? "EDIT FACILITY" : "ADD NEW FACILITY";

  // Load type list
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

  // Load facility details
  useEffect(() => {
    const fetchFacility = async () => {
      if (id && open) {
        try {
          const data = await loadDataById(id);
          setName(data.entity.name || "");
          setIcon(data.entity.icon || "");

          // So sánh type từ API (số) với id của danh sách dropdown
          const matched = typeData.find(
            (t) => t.id === (typeof data.entity.type === "object" ? data.entity.type.id : data.entity.type)
          );
          setType(matched || null);
        } catch (err) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to load facility data",
            life: 3000,
          });
        }
      } else {
        setName("");
        setIcon("");
        setType(null);
      }
    };

    if (typeData.length > 0 && open) {
      fetchFacility();
    }
  }, [id, open, typeData, loadDataById]);

  const submit = async () => {
    setSubmitting(true);
    const facilityDTO = { name, icon, type: type?.id };
    try {
      if (id) {
        await updateItem(id, facilityDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Facility updated",
          life: 3000,
        });
      } else {
        await createItem(facilityDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Facility created",
          life: 3000,
        });
      }
      onClose();
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to save facility",
        life: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getError = (field: string) =>
    (error && typeof error === "object" && (error as any)[field]) || null;

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={open}
        onHide={onClose}
        header={header}
        footer={
          <div className="flex justify-end gap-2 px-4 pb-3">
            <Button
              label="Close"
              onClick={onClose}
              severity="secondary"
              outlined
              disabled={submitting}
              style={{ padding: "8px 40px" }}
            />
            <Button
              label="Save"
              onClick={submit}
              severity="success"
              disabled={submitting}
              loading={submitting}
              style={{ padding: "8px 40px" }}
            />
          </div>
        }
        style={{ width: "40%" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="grid grid-cols-1 gap-6 p-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="font-semibold block mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="w-full"
            />
            {getError("name") && (
              <small className="p-error text-red-500">
                {getError("name")}
              </small>
            )}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="font-semibold block mb-1">
              Type
            </label>
            <Dropdown
              id="type"
              value={type}
              onChange={(e) => setType(e.value)}
              options={typeData}
              optionLabel="name"
              placeholder="Select a type"
              className="w-full"
              checkmark
              highlightOnSelect={false}
              disabled={submitting}
            />
            {getError("type") && (
              <small className="p-error text-red-500">
                {getError("type")}
              </small>
            )}
          </div>

          {/* Icon */}
          <div>
            <label htmlFor="icon" className="font-semibold block mb-1">
              Icon
            </label>
            <div className="flex items-center gap-3">
              <InputText
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                disabled={submitting}
                placeholder="e.g. pi pi-check"
                className="flex-1 min-w-0"
              />
              {icon && <i className={`${icon} text-xl`} />}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
