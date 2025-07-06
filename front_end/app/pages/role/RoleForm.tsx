import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";

import { fetchCommonData } from "~/store/slice/commonDataSlice";  // Adjust path if needed
import { useDispatch } from "react-redux";
import type { AppDispatch } from "~/store";
import { toast } from "react-toastify";


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
  
  const dispatch: AppDispatch = useDispatch();

  const header = mode === "edit" ? "EDIT ROLE" : "ADD NEW ROLE";

  const submit = async () => {
    setSubmitting(true);
    const roleDTO = { name, description, status };
    try {
      if (id) {
        await updateItem(id, roleDTO);
           toast.success("Updated successfully", {
                          autoClose: 3000,
                      });
        await dispatch(fetchCommonData({ types: ["roles"], force: true }));
      } else {
        await createItem(roleDTO);
        toast.success("Created successfully", {
                          autoClose: 3000,
                      });

        await dispatch(fetchCommonData({ types: ["roles"], force: true }));
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save role", {
                  autoClose: 3000,
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
         
        toast.error("Failed to load role", {
          autoClose: 3000,
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
