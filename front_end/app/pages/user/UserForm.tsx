import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import ImageUploader from "@/utils/ImageUploader";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import $axios from "@/axios";
import { MultiSelect } from "primereact/multiselect";
import "./UserFrom.scss";

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
  const [roleData, setRoleData] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);
  const [provinceData, setProvinceData] = useState<any[]>([]);
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [wardData, setWardData] = useState<any[]>([]);
  const [streetData, setStreetData] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [selectedStreet, setSelectedStreet] = useState<any>(null);
  const [streetNumber, setStreetNumber] = useState("");

  const toast = useRef<Toast>(null);

  const header = mode === "edit" ? "EDIT ROLE" : "ADD NEW ROLE";

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await $axios.get("/local/get-province");
        setProvinceData(res.data.result);
      } catch (error: any) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error.response?.data?.message || "Failed to load provinces",
          life: 3000,
        });
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province is selected
  useEffect(() => {
    if (
      selectedProvince?.code &&
      typeof selectedProvince.code === "string" &&
      selectedProvince.code.trim() !== ""
    ) {
      const fetchDistricts = async () => {
        try {
          const res = await $axios.get(
            `/local/get-district?provinceCode=${selectedProvince.code}`
          );
          setDistrictData(res.data.result);

          if (userData?.districtCode) {
            const selectedDistrict =
              res.data.result.find(
                (district: any) => district.code === userData.districtCode
              ) || null;
            setSelectedDistrict(selectedDistrict);
          } else {
            setSelectedDistrict(null);
          }

          setWardData([]);
          setSelectedWard(null);
          setStreetData([]);
          setSelectedStreet(null);
        } catch (error: any) {
          let errorMessage = "Failed to load districts";
          if (error.response?.data?.errors) {
            errorMessage = Object.values(error.response.data.errors).join("; ");
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: errorMessage,
            life: 3000,
          });
        }
      };
      fetchDistricts();
    } else {
      setDistrictData([]);
      setSelectedDistrict(null);
      setWardData([]);
      setSelectedWard(null);
      setStreetData([]);
      setSelectedStreet(null);
    }
  }, [selectedProvince, userData]);

  // Fetch wards when district is selected
  useEffect(() => {
    if (
      selectedDistrict?.code &&
      typeof selectedDistrict.code === "string" &&
      selectedDistrict.code.trim() !== ""
    ) {
      const fetchWards = async () => {
        try {
          const res = await $axios.get(
            `/local/get-ward?districtCode=${selectedDistrict.code}`
          );
          setWardData(res.data.result);

          if (userData?.wardCode) {
            const selectedWard =
              res.data.result.find(
                (ward: any) => ward.code === userData.wardCode
              ) || null;
            setSelectedWard(selectedWard);
          } else {
            setSelectedWard(null);
          }

          // Reset các state phụ thuộc
          setStreetData([]);
          setSelectedStreet(null);
        } catch (error: any) {
          let errorMessage = "Failed to load wards";
          if (error.response?.data?.errors) {
            errorMessage = Object.values(error.response.data.errors).join("; ");
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: errorMessage,
            life: 3000,
          });
        }
      };
      fetchWards();
    } else {
      setWardData([]);
      setSelectedWard(null);
      setStreetData([]);
      setSelectedStreet(null);
    }
  }, [selectedDistrict, userData]);

  // Fetch streets when ward is selected
  useEffect(() => {
    if (
      selectedWard?.code &&
      typeof selectedWard.code === "string" &&
      selectedWard.code.trim() !== ""
    ) {
      const fetchStreets = async () => {
        try {
          const res = await $axios.get(
            `/local/get-street?wardCode=${selectedWard.code}`
          );
          setStreetData(res.data.result);

          if (userData?.streetId) {
            const selectedStreet =
              res.data.result.find(
                (street: any) => street.id === userData.streetId
              ) || null;
            setSelectedStreet(selectedStreet);
          } else {
            setSelectedStreet(null);
          }
        } catch (error: any) {
          let errorMessage = "Failed to load streets";
          if (error.response?.data?.errors) {
            errorMessage = Object.values(error.response.data.errors).join("; ");
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: errorMessage,
            life: 3000,
          });
        }
      };
      fetchStreets();
    } else {
      setStreetData([]);
      setSelectedStreet(null);
    }
  }, [selectedWard, userData]);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await $axios.get("/user/get-roles");
        setRoleData(res.data.result);
      } catch (error: any) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error.response?.data?.message || "Failed to load roles",
          life: 3000,
        });
      }
    };
    fetchRoles();
  }, []);

  // Load user data when editing/viewing
  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then((data) => {
          setUserData(data);
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setPhoneNumber(data.phoneNumber || "");
          setStatus(data.status ?? true);
          setAvatarUrl(data.avatarUrl || null);
          setSelectedFile(null);
          setSelectedRoles(data.roles || []);
          setStreetNumber(data.streetNumber || "");

          const selectedProvince =
            provinceData.find(
              (province) => province.code === data.provinceCode
            ) || null;
          setSelectedProvince(selectedProvince);

          setSelectedDistrict(null);
          setSelectedWard(null);
          setSelectedStreet(null);

          if (data.roles && roleData.length > 0) {
            const selectedRoles = roleData.filter((role) =>
              data.roles.some((userRole: any) => userRole.roleId === role.id)
            );
            setSelectedRoles(selectedRoles);
          } else {
            setSelectedRoles([]);
          }
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
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setSelectedStreet(null);
      setStreetNumber("");
    }
  }, [id, open, loadDataById]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedProvince?.code ||
      !selectedDistrict?.code ||
      !selectedWard?.code ||
      !selectedStreet?.id ||
      !streetNumber
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields",
        life: 3000,
      });
      return;
    }

    setSubmitting(true);
    const formData = new FormData();

    formData.append("fullName", fullName);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
    }
    formData.append("phoneNumber", phoneNumber);
    formData.append("provinceCode", selectedProvince.code);
    formData.append("districtCode", selectedDistrict.code);
    formData.append("wardCode", selectedWard.code);
    formData.append("streetId", selectedStreet.id.toString());
    formData.append("streetNumber", streetNumber);
    formData.append("status", JSON.stringify(status));

    if (selectedFile) {
      formData.append("keepAvatar", "false");
      formData.append("avatarUrl", selectedFile, selectedFile.name);
      console.log("FormData after append:", Object.fromEntries(formData));
    } else if (avatarUrl) {
      formData.append("keepAvatar", "true");
    }

    const rolesIds = selectedRoles.map((role) => role.id);
    rolesIds.forEach((roleId) => {
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

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={open}
        onHide={onClose}
        header={header}
        footer={
          <div className="flex justify-end gap-3 p-4">
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
                onFileChange={(files) =>
                  setSelectedFile(files ? files[0] : null)
                }
                maxFileSize={2}
                maxCount={1}
                initialImageUrls={
                  avatarUrl
                    ? [
                        `${
                          import.meta.env.VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
                        }/${avatarUrl}`,
                      ]
                    : []
                }
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
                    options={roleData}
                    optionLabel="name"
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
              </div>
            </div>

            {/* Address */}
            <div className="col-span-12 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Address Information
              </h3>
            </div>
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-3">
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Province <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  id="province"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.value)}
                  options={provinceData}
                  optionLabel="name"
                  placeholder="Select a Province"
                  className={`w-full ${
                    getError("province") ? "p-invalid" : ""
                  }`}
                  disabled={submitting}
                />
                {getError("province") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("province")}
                  </small>
                )}
              </div>
              <div className="col-span-12 md:col-span-3">
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  District <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  id="district"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.value)}
                  options={districtData}
                  optionLabel="name"
                  placeholder="Select a District"
                  className={`w-full ${
                    getError("district") ? "p-invalid" : ""
                  }`}
                  disabled={submitting || !selectedProvince}
                />
                {getError("district") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("district")}
                  </small>
                )}
              </div>
              <div className="col-span-12 md:col-span-3">
                <label
                  htmlFor="ward"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ward <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  id="ward"
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.value)}
                  options={wardData}
                  optionLabel="name"
                  placeholder="Select a Ward"
                  className={`w-full ${getError("ward") ? "p-invalid" : ""}`}
                  disabled={submitting || !selectedDistrict}
                />
                {getError("ward") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("ward")}
                  </small>
                )}
              </div>
              <div className="col-span-12 md:col-span-3">
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  id="street"
                  value={selectedStreet}
                  onChange={(e) => setSelectedStreet(e.value)}
                  options={streetData}
                  optionLabel="name"
                  placeholder="Select a Street"
                  className={`w-full ${getError("street") ? "p-invalid" : ""}`}
                  disabled={submitting || !selectedWard}
                />
                {getError("street") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("street")}
                  </small>
                )}
              </div>
              <div className="col-span-12 md:col-span-12">
                <label
                  htmlFor="streetNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street Number <span className="text-red-500">*</span>
                </label>
                <InputText
                  id="streetNumber"
                  value={streetNumber}
                  onChange={(e) => setStreetNumber(e.target.value)}
                  disabled={submitting}
                  className={`w-full p-2 border rounded-lg ${
                    getError("streetNumber") ? "p-invalid" : ""
                  }`}
                />
                {getError("streetNumber") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("streetNumber")}
                  </small>
                )}
              </div>
            </div>

            {/* Trạng thái */}
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
