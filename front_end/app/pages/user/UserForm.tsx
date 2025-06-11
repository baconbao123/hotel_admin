import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import styles from "./UserFrom.module.scss";
import ImageUploader from "@/utils/ImageUploader";
import { InputSwitch } from "primereact/inputswitch";

interface Props {
  readonly id?: string;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly loadDataById: (id: string) => Promise<any>;
  readonly loadDataTable: () => Promise<void>;
  readonly createItem: (data: object | FormData) => Promise<any>;
  readonly updateItem: (id: string, data: object | FormData) => Promise<any>;
}

export default function UserForm({
  id,
  open = false,
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

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancel"
        onClick={onClose}
        className="p-button-text"
        disabled={submitting}
      />
      <Button
        label="Save"
        type="submit"
        form="user-form"
        className="p-button-text"
        disabled={submitting}
        loading={submitting}
      />
    </div>
  );

  const getHeader = (): string => {
    return id ? "EDIT USER" : "ADD NEW USER";
  };

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
          setSelectedFile(null); // Clear selected file for edit
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
      // Reset for new user
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
                console.log("File từ ImageUploader:", files);
                setSelectedFile(files ? files[0] : null);
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
                  disabled={submitting}
                />
              </div>
            </div>

            <div className={styles.group_b}>
              <div className={styles.field_input}>Email</div>
              <div className={styles.input_enter}>
                <InputText
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
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
                  disabled={submitting}
                />
              </div>
            </div>

            <div className={styles.group_b}>
              <div className={styles.field_input}>Address</div>
              <div className={styles.input_enter}>
                <InputText
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div style={{ height: "10px" }}></div>

          <div className={styles.group_input}>
            <div className={styles.group_a}>
              <div className={styles.field_input}>Password</div>
              <div className={styles.input_enter}>
                <InputText
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className={styles.group_b}>
              <div className={styles.field_input}>Status</div>
              <div className={styles.input_enter}>
                <InputSwitch
                  checked={status}
                  onChange={(e) => setStatus(e.value)}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
