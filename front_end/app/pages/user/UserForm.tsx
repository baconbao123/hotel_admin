import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import ImageUploader from "~/utils/ImageUploader";
import { InputSwitch } from "primereact/inputswitch";
import { MultiSelect } from "primereact/multiselect";
import { useCommonData } from "~/hook/useCommonData";
import { useSelector } from "react-redux";
import $axios from "~/axios";
import { useAppDispatch, type RootState } from "~/store";
import { Dropdown } from "primereact/dropdown";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [viewChangePassword, setViewChangePassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [selectedType, setSelectedType] = useState<any>(null);
  const dispatch = useAppDispatch();

  const { commonData } = useCommonData(["roles", "usertypes"]);

  const rolesData = commonData.roles ?? [];
  const userTypes = commonData.userTypes ?? [];


  const header = mode === "edit" ? "EDIT USER" : "ADD USER";

  const permissions = useSelector(
    (state: RootState) => state.permissionSlice.permissions
  );

  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then((data) => {
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setPhoneNumber(data.phoneNumber || "");
          setStatus(data.status ?? true);
          setAvatarUrl(data.avatarUrl || null);
          setSelectedFile(null);

          const userTyped = userTypes.find((u) => u.id == data.userTypeId);
          setSelectedType(userTyped);

          const selectedRoleIds = rolesData
            .filter((role) => data.roles.some((r: any) => r.roleId === role.id))
            .map((role) => role.id);
          setSelectedRoles(selectedRoleIds);
        })
        .catch((error: any) => {
          toast.error(error.response?.data?.message || "Failed to load user data", {autoClose: 3000})

        });
    } else {
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setStatus(true);
      setAvatarUrl(null);
      setSelectedFile(null);
      setSelectedRoles([]);
      setSelectedType(null);
    }
  }, [id, open, loadDataById]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const checkPasswords = () => {
      if (confirmPassword && newPassword !== confirmPassword) {
        setPasswordsMatch(false);
        timeout = setTimeout(() => {
          setShowError(true);
        }, 700);
      } else {
        setPasswordsMatch(true);
        setShowError(false);
      }
    };

    checkPasswords();

    return () => clearTimeout(timeout);
  }, [newPassword, confirmPassword]);

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

    formData.append("userTypeId", selectedType?.id || "");

    selectedRoles.forEach((roleId) => {
      formData.append("rolesIds", roleId.toString());
    });

    try {
      if (id) {
        await updateItem(id, formData);
        toast.success("User updated successfully", {autoClose: 3000})

      } else {
        await createItem(formData);
        toast.success( "User created successfully", {autoClose: 3000})

      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save user", {autoClose: 3000})
    } finally {
      setSubmitting(false);
    }
  };

  const getError = (field: string) =>
    (error &&
      typeof error === "object" &&
      (error as Record<string, string>)[field]) ||
    null;

  const hasPermission = (actionName: string) => {
    const resource = permissions.find((p: any) => p.resourceName === "User");
    return resource ? resource.actionNames.includes(actionName) : false;
  };

  const handleChangePassword = async () => {
    if (!passwordsMatch) {
      toast.error( "Password don't match", {autoClose: 3000})

      return;
    }

    setSubmitting(true);
    try {
      const res = await $axios.put(
        `/user/change-password?email=${email}&password=${newPassword}`
      );
      if (res.status === 200) {
        setNewPassword("");
        setConfirmPassword("");
        setViewChangePassword(false);
        toast.success( "Password updated successfully", {autoClose: 3000})
      }
    } catch (err: any) {

      toast.error( err.message || "Failed to change password", {autoClose: 3000})
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Dialog
        visible={open}
        onHide={onClose}
        header={header}
        footer={
          <div className="flex justify-center gap-2">
            {hasPermission('change_password') && mode === "edit" && (
              <Button
                severity="secondary"
                raised
                label="Change Password"
                onClick={() => setViewChangePassword(!viewChangePassword)}
                style={{ color: "white" }}
              />

            )}
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
              loading={submitting}
              className="btn_submit"
              style={{ padding: "8px 40px" }}
            />
   
          </div>
        }
        style={{ width: "50%", maxWidth: "95vw" }}
        modal
        className="p-fluid rounded-lg shadow-lg bg-white"
        breakpoints={{ "960px": "85vw", "641px": "95vw" }}
      >
        <div className="pl-4 pr-4">
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
                maxFileSize={100}
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
                    htmlFor="roles"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Roles
                  </label>
                  <MultiSelect
                    id="roles"
                    value={selectedRoles}
                    onChange={(e) => setSelectedRoles(e.value)}
                    options={rolesData}
                    optionLabel="name"
                    optionValue="id"
                    display="chip"
                    placeholder="Select Roles"
                    maxSelectedLabels={3}
                    className={`w-full ${getError("roles") ? "p-invalid" : ""}`}
                    disabled={submitting}
                  />
                  {getError("roles") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("roles")}
                    </small>
                  )}
                </div>

                {!id && (
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
                )}

                <div>
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-700"
                  >
                    User Type <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.value)}
                    options={userTypes}
                    optionLabel="name"
                    placeholder="Select user type"
                    className="w-full md:w-14rem"
                  />
                  {getError("status") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("status")}
                    </small>
                  )}
                </div>

                <div className="flex items-center gap-3">
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

                {id && hasPermission("change_password") && (
                  <div className="mt-3">
          
                    {viewChangePassword && (
                      <Dialog
                        header="Change Password"
                        visible={viewChangePassword}
                        style={{ width: "40vw" }}
                        onHide={() => {
                          if (!viewChangePassword) return;
                          setViewChangePassword(false);
                        }}
                        footer={
                          <div className="flex justify-center gap-2">
                            <Button
                              label="Close"
                              onClick={() =>
                                setViewChangePassword(!viewChangePassword)
                              }
                              severity="secondary"
                              outlined
                              disabled={submitting}
                              className="px-6 py-2 rounded-lg"
                            />
                            <Button
                              label="Save"
                              onClick={handleChangePassword}
                              disabled={submitting}
                              loading={submitting}
                              className="px-6 py-2 rounded-lg"
                            />
                          </div>
                        }
                      >
                        <div className="col-span-12 md:col-span-12">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="status"
                                className="text-sm font-medium text-gray-700"
                              >
                                New Password{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <InputText
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="password"
                                disabled={submitting}
                                className={`w-full p-2 border rounded-lg ${
                                  getError("newPassword") ? "p-invalid" : ""
                                }`}
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="status"
                                className="text-sm font-medium text-gray-700"
                              >
                                Confirm Password
                                <span className="text-red-500">*</span>
                              </label>
                              <InputText
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                                type="password"
                                disabled={submitting}
                                className={`w-full p-2 border rounded-lg ${
                                  getError("newPassword") ? "p-invalid" : ""
                                }`}
                              />
                            </div>
                          </div>

                          {showError && !passwordsMatch && (
                            <div className="flex justify-center mt-2">
                              <span className="text-red-500">
                                Passwords don't match
                              </span>
                            </div>
                          )}
                        </div>
                      </Dialog>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
