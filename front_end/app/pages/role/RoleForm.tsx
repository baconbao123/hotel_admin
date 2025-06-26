import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
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

export default function RoleForm({
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
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useRef<Toast>(null);
  const dispatch = useAppDispatch();

  const header = mode === "edit" ? "EDIT ROLE" : "ADD NEW ROLE";

  const submit = async () => {
    setSubmitting(true);
    const roleDTO = { name, description, status };
    try {
      if (id) {
        await updateItem(id, roleDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Role updated",
          life: 3000,
        });
        await dispatch(
          fetchCommonData({ types: ["roles"], forceRefresh: true })
        );
      } else {
        await createItem(roleDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Role created",
          life: 3000,
        });

        await dispatch(
          fetchCommonData({ types: ["roles"], forceRefresh: true })
        );
      }
      onClose();
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to save role",
        life: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getError = (field: string) =>
    (error &&
      typeof error === "object" &&
      (error as Record<string, string>)[field]) ||
    null;

  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then((data) => {
          setName(data.entity.name || "");
          setDescription(data.entity.description || "");
          setStatus(data.entity.status ?? true);
        })
        .catch(() =>
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to load role",
            life: 3000,
          })
        );
    } else {
      setName("");
      setDescription("");
      setStatus(true);
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
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Enter name"
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

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <InputText
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                placeholder="Enter description"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  getError("description") ? "p-invalid" : ""
                }`}
              />
              {getError("description") && (
                <small className="text-red-600 text-xs mt-1 block">
                  {getError("description")}
                </small>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-4 mt-4">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <InputSwitch
                id="status"
                checked={status}
                onChange={(e) => setStatus(e.value)}
                disabled={submitting}
                tooltip="Enable/disable role visibility"
                tooltipOptions={{ position: "top" }}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
