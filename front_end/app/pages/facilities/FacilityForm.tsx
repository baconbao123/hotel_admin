import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useCommonData } from "@/hooks/useCommonData";
import { useAppDispatch } from "@/store"; // Import useAppDispatch from your store
import { fetchCommonData } from "@/store/slices/commonDataSlice"; // Adjust path if needed
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
  mode = "view",
  onClose,
  loadDataById,
  createItem,
  updateItem,
  error,
}: Props) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const { commonData } = useCommonData(["facilitiestype"]);

  const facilitiesData = commonData.facilityTypes ?? [];

  const toast = useRef<Toast>(null);
  const dispatch = useAppDispatch();

  const resetForm = () => {
    setName("");
    setIcon("");
    setType(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "edit" && id && facilitiesData.length > 0) {
        try {
          const data = await loadDataById(id);
          console.log("Data loaded:", data);

          setName(data.name || "");
          setIcon(data.icon || "");

          const matched = facilitiesData.find((t: any) =>
            typeof data.type === "object"
              ? t.id === data.type.id
              : t.id === data.type
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
      }

      if (mode === "create") {
        resetForm();
      }
    };

    if (open) {
      fetchData();
    }
  }, [id, open, mode, facilitiesData]);

  const submit = async () => {
    setSubmitting(true);
    const facilityDTO = { name, icon, type: type?.id };

    try {
      if (mode === "edit" && id) {
        await updateItem(id, facilityDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Facility updated",
          life: 3000,
        });
        await dispatch(
          fetchCommonData({ types: ["facilitiestype"], force: true })
        );
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

  const header = mode === "edit" ? "EDIT" : "ADD";

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
              disabled={submitting}
              severity="success"
              className="btn_submit"
              loading={submitting}
              style={{ padding: "8px 40px" }}
            />
          </div>
        }
        style={{ width: "50%" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                getError("name") ? "p-invalid" : ""
              }`}
            />
            {getError("name") && (
              <small className="text-red-600 text-xs mt-1 block">
                {getError("name")}
              </small>
            )}
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="type"
              value={type}
              onChange={(e) => setType(e.value)}
              options={facilitiesData}
              optionLabel="name"
              placeholder="Select a type"
              style={{ width: "100%" }} // ✅ giữ
              className={`w-full border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                getError("type") ? "p-invalid" : ""
              }`} // ❌ bỏ p-2
              checkmark
              highlightOnSelect={false}
              disabled={submitting}
            />

            {getError("type") && (
              <small className="p-error text-red-500">{getError("type")}</small>
            )}
          </div>

          {/* Icon */}
          <div className="sm:col-span-2">
            <div className="w-full">
              <label
                htmlFor="icon"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Icon <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputText
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  disabled={submitting}
                  placeholder="e.g. pi pi-check"
                  className="w-full"
                />
                {icon && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <i className={`${icon} text-xl`} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
