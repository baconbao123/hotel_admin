import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import styles from "./UserFrom.module.scss";
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

export default function RoleForm({
  id,
  open = false,
  mode = "create",
  onClose,
  loadDataById,
  loadDataTable,
  createItem,
  updateItem,
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
    <div className="flex justify-end gap-2">
      <Button
        label="Close"
        onClick={onClose}
        className="p-button-text"
        disabled={submitting}
      />
      {mode !== "view" && (
        <Button
          label="Save"
          type="submit"
          form="user-form"
          className="p-button-text"
          disabled={submitting}
          loading={submitting}
        />
      )}
    </div>
  );

  const submitData = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    const roleDTO = { name, description, status };

    try {
      if (id) {
        await updateItem(id, roleDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "User updated successfully",
          life: 3000,
        });
      } else {
        await createItem(roleDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "User created successfully",
          life: 3000,
        });
      }
      await loadDataTable(); // Refresh table
      onClose(); // Close form
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to save user",
        life: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then((roleData) => {
          setName(roleData.name || "");
          setDescription(roleData.description || "");
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
        style={{ width: "50%" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <form id="user-form" onSubmit={submitData}>
          <div className={styles.group_input}>
            <div className={styles.field_input}>Name</div>
            <div className={styles.input_enter}>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={mode === "view" || submitting}
              />
            </div>
          </div>

          <div style={{ height: "10px" }}></div>

          <div className={styles.group_input}>
            <div className={styles.group_a}>
              <div className={styles.field_input}>Description</div>
              <div className={styles.input_enter}>
                <InputText
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={mode === "view" || submitting}
                />
              </div>
            </div>

            <div className={styles.group_b}>
              <div className={styles.field_input}>Status</div>
              <div className={styles.input_enter}>
                {mode === "view" ? (
                  <ViewStatus status={status} />
                ) : (
                  <InputSwitch
                    checked={status}
                    onChange={(e) => setStatus(e.value)}
                    disabled={submitting}
                  />
                )}
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
