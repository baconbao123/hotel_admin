import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";

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
      } else {
        await createItem(roleDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Role created",
          life: 3000,
        });
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
          setName(data.name || "");
          setDescription(data.description || "");
          setStatus(data.status ?? true);
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
    <div className="z-50">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
            {getError("name") && (
              <small className="p-error text-red-500">{getError("name")}</small>
            )}
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <InputText
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="flex align-items-center gap-4">
            <label htmlFor="status">Status</label>
            <InputSwitch
              id="status"
              className="w-50"
              checked={status}
              onChange={(e) => setStatus(e.value)}
              disabled={submitting}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
