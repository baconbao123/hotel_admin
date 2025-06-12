import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import styles from "./UserFrom.module.scss";
import ImageUploader from "@/utils/ImageUploader";
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

export default function UserForm({
  id,
  open = false,
  mode = "create",
  onClose,
  loadDataById,
  loadDataTable,
  createItem,
  updateItem,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useRef<Toast>(null);

  const getHeader = (): string => {
    switch (mode) {
      case "view":
        return "USER DETAILS";
      case "edit":
        return "EDIT USER";
      default:
        return "ADD NEW USER";
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
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
    }
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("status", JSON.stringify(status));
    if (selectedFile) {
      if (selectedFile) {
        formData.append("avatarUrl", selectedFile, selectedFile.name);
      }
    }

    try {
      if (id) {
        await updateItem(id, formData);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "User updated successfully",
          life: 3000,
        });
      } else {
        await createItem(formData);
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
        .then((userData) => {
          setFullName(userData.fullName || "");
          setAddress(userData.address || "");
          setEmail(userData.email || "");
          setPhoneNumber(userData.phoneNumber || "");
          setStatus(userData.status ?? true);
          setAvatarUrl(userData.avatarUrl || null);
          setSelectedFile(null); 
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
      
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setAddress("");
      setStatus(true);
      setAvatarUrl(null);
      setSelectedFile(null);
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
            <div className={styles.field_input}>Avatar</div>
            <ImageUploader
              onFileChange={(files) => {
                if (mode !== "view") {
                  setSelectedFile(files ? files[0] : null);
                }
              }}
              maxFileSize={2}
              maxCount={1}
              initialImageUrl={
                avatarUrl
                  ? `${
                      import.meta.env.VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
                    }/${avatarUrl}`
                  : undefined
              }
              disabled={mode === "view"}
            />
          </div>

          <div style={{ height: "10px" }}></div>

          <div className={styles.group_input}>
            <div className={styles.group_a}>
              <div className={styles.field_input}>Full name</div>
              <div className={styles.input_enter}>
                <InputText
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={mode === "view" || submitting}
                />
              </div>
            </div>

            <div className={styles.group_b}>
              <div className={styles.field_input}>Email</div>
              <div className={styles.input_enter}>
                <InputText
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={mode === "view" || submitting}
                />
              </div>
            </div>
          </div>

          <div style={{ height: "10px" }}></div>

          <div className={styles.group_input}>
            <div className={styles.group_a}>
              <div className={styles.field_input}>Phone number</div>
              <div className={styles.input_enter}>
                <InputText
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={mode === "view" || submitting}
                />
              </div>
            </div>

            <div className={styles.group_b}>
              <div className={styles.field_input}>Address</div>
              <div className={styles.input_enter}>
                <InputText
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={mode === "view" || submitting}
                />
              </div>
            </div>
          </div>

          <div className={styles.group_input}>
            <div className={styles.group_a}>
              <div className={styles.field_input}>Password</div>
              <div className={styles.input_enter}>
                <InputText
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
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
