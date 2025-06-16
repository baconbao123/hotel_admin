import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { Tag } from "primereact/tag";
interface Props {
  readonly id?: string;
  readonly open: boolean;
  readonly mode?: "create" | "edit" | "view";
  readonly onClose: () => void;
  readonly loadDataById: (id: string) => Promise<any>;
  readonly loadDataTable: () => Promise<void>;
  readonly createItem: (data: object | FormData) => Promise<any>;
  readonly updateItem: (id: string, data: object | FormData) => Promise<any>;
  readonly error: Object | null;
}

const ViewStatus = ({ status }: { status: boolean }) => {
  return (
    <Tag
      value={status ? "Active" : "Inactive"}
      severity={status ? "success" : "danger"}
      style={{
        maxWidth: "7rem",
        display: "flex",
        justifyContent: "center",
        padding: "0.3rem 0.6rem",
      }}
    />
  );
};

export default function RoleDetail({
  id,
  open = false,
  mode = "create",
  onClose,
  loadDataById,
  loadDataTable,
  createItem,
  updateItem,
  error
}: Props) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useRef<Toast>(null);

  const getHeader = (): string => {
    switch (mode) {
      case "view":
        return "ROLE DETAILS";
      case "edit":
        return "EDIT ROLE";
      default:
        return "ADD NEW ROLE";
    }
  };

  const footer = (
    <div className="flex justify-center gap-2">
      <Button
        label="Close"
        onClick={onClose}
        severity="secondary"
        style={{padding: '8px 40px '}}
        disabled={submitting}
      />
    </div>
  );

  const submitData = async () => {
    setSubmitting(true);
    const roleDTO = { name, description, status };

    try {
      if (id) {
        await updateItem(id, roleDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Role updated successfully",
          life: 3000,
        });
      } else {
        await createItem(roleDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Role created successfully",
          life: 3000,
        });
      }

      onClose();
    } catch (error: any) {
      console.log( error?.response);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message ?? "Failed to save role",
        life: 3000,
      });
    } 
    finally {
      setSubmitting(false);
    }
  };

  const getErrorMessage = (field: string): string | null => { 
    if (error && typeof error === 'object' && error !== null && field in error) {
      return (error as Record<string, string>)[field] || null;
    }
    return null;
  }
  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then((roleData) => {
          setName(roleData.name ?? "");
          setDescription(roleData.description ?? "");
          setStatus(roleData.status ?? true);
        })
        .catch((err) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to load user data",
            life: 3000,
          });
        });
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
        header={getHeader()}
        footer={footer}
        style={{ width: "40%" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="name" className="font-bold col-span-1">Name:</label>
            <span id="name" className="col-span-2">
                {name || '-'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="description" className="font-bold col-span-1">Description:</label>
            <span id="description" className="col-span-2">
              {description || '-'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="status" className="font-bold col-span-1">Status:</label>
            <span id="status" className="col-span-2">
              <Tag value={status ? 'Active' : 'Inactive'} severity={status ? 'success' : 'danger'} />
            </span>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
