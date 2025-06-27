import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import ImageUploader from "@/utils/ImageUploader";
import { InputSwitch } from "primereact/inputswitch";
import { MultiSelect } from "primereact/multiselect";
import { useRoles } from "@/hooks/useCommonData";
import "./UserForm.scss";
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

export default function UserForm({
  id,
  open,
  mode = "create",
  onClose,
  loadDataById,
  createItem,
  updateItem,
  error,
}: Props) {
  const [userData, setUserData] = useState<any>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]); // Lưu mảng id

  const { roles, loading: rolesLoading, error: rolesError } = useRoles();

  const toast = useRef<Toast>(null);

  const header = mode === "edit" ? "EDIT USER" : "ADD NEW USER";

  useEffect(() => {
    if (id && open && !rolesLoading) {
      loadDataById(id)
        .then((data) => {
          setUserData(data);
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setPhoneNumber(data.phoneNumber || "");
          setStatus(data.status ?? true);
          setAvatarUrl(data.avatarUrl || null);
          setSelectedFile(null);

          const selectedRoleIds = roles
            .filter((role) => data.roles.some((r: any) => r.roleId === role.id))
            .map((role) => role.id);
          setSelectedRoles(selectedRoleIds);
        })
        .catch((error: any) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || "Failed to load user data",
            life: 3000,
          });
        });
    } else {
      setUserData(null);
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setStatus(true);
      setAvatarUrl(null);
      setSelectedFile(null);
      setSelectedRoles([]);
    }
  }, [id, open, loadDataById, roles, rolesLoading]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    const formData = new FormData();

    formData.append("fullName", fullName);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
    }
    formData.append("phoneNumber", phoneNumber);
    formData.append("status", JSON.stringify(status));

    if (selectedFile) {
      formData.append("keepAvatar", "false");
      formData.append("avatarUrl", selectedFile, selectedFile.name);
    } else if (avatarUrl) {
      formData.append("keepAvatar", "true");
    }

    // Thêm rolesIds từ selectedRoles
    selectedRoles.forEach((roleId) => {
      formData.append("rolesIds", roleId.toString());
    });

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
      onClose();
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to save user",
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
              className="px-6 py-2 rounded-lg"
            />
            <Button
              label="Save"
              onClick={submit}
              severity="success"
              disabled={submitting}
              loading={submitting}
              className="px-6 py-2 rounded-lg"
            />
          </div>
        }
        style={{ width: "50rem", maxWidth: "95vw" }}
        modal
        className="p-fluid rounded-lg shadow-lg bg-white"
        breakpoints={{ "960px": "85vw", "641px": "95vw" }}
      >
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="col-span-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                User Information
              </h3>
            </div>

            {/* Avatar */}
            <div className="col-span-12 md:col-span-4">
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Avatar
              </label>
              <ImageUploader
                initialImageUrl={
                  avatarUrl
                    ? `${
                        import.meta.env.VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
                      }/${avatarUrl}`
                    : undefined
                }
                onFileChange={(file) => setSelectedFile(file)}
                maxFileSize={2}
                disabled={submitting}
              />
              {getError("avatar") && (
                <small className="text-red-500 text-xs mt-1">
                  {getError("avatar")}
                </small>
              )}
            </div>
            <div className="col-span-12 md:col-span-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={submitting}
                    className={`w-full p-2 border rounded-lg ${
                      getError("fullName") ? "p-invalid" : ""
                    }`}
                  />
                  {getError("fullName") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("fullName")}
                    </small>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className={`w-full p-2 border rounded-lg ${
                      getError("email") ? "p-invalid" : ""
                    }`}
                  />
                  {getError("email") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("email")}
                    </small>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <InputText
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={submitting}
                    className={`w-full p-2 border rounded-lg ${
                      getError("phoneNumber") ? "p-invalid" : ""
                    }`}
                  />
                  {getError("phoneNumber") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("phoneNumber")}
                    </small>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    disabled={submitting}
                    className={`w-full p-2 border rounded-lg ${
                      getError("password") ? "p-invalid" : ""
                    }`}
                  />
                  {getError("password") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("password")}
                    </small>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="roles"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Roles
                  </label>
                  <MultiSelect
                    id="roles"
                    value={selectedRoles}
                    onChange={(e) => setSelectedRoles(e.value)}
                    options={roles}
                    optionLabel="name"
                    optionValue="id"
                    display="chip"
                    placeholder="Select Roles"
                    maxSelectedLabels={3}
                    className={`w-full ${getError("roles") ? "p-invalid" : ""}`}
                    disabled={submitting || rolesLoading}
                  />
                  {getError("roles") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("roles")}
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-12 flex items-center gap-4 mt-4">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <InputSwitch
                id="status"
                checked={status}
                onChange={(e) => setStatus(e.value)}
                disabled={submitting}
              />
              {getError("status") && (
                <small className="text-red-500 text-xs mt-1">
                  {getError("status")}
                </small>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
