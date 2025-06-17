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

          // Nếu đang chỉnh sửa/xem và có userData, chọn quận
          if (userData?.districtCode) {
            const selectedDistrict =
              res.data.result.find(
                (district: any) => district.code === userData.districtCode
              ) || null;
            setSelectedDistrict(selectedDistrict);
          } else {
            setSelectedDistrict(null);
          }

          // Reset các state phụ thuộc
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

          // Nếu đang chỉnh sửa/xem và có userData, chọn phường
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

          // Nếu đang chỉnh sửa/xem và có userData, chọn đường
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

          // Reset các state phụ thuộc
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
          <div className="flex justify-center gap-2">
            <Button
              label="Close"
              onClick={onClose}
              severity="secondary"
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
        style={{ width: "50%" }}
        modal
        className="dialog p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="avatar">Avatar</label>
            <ImageUploader
              onFileChange={(files) => setSelectedFile(files ? files[0] : null)}
              maxFileSize={2}
              maxCount={1}
              initialImageUrl={
                avatarUrl
                  ? `${
                      import.meta.env.VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
                    }/${avatarUrl}`
                  : undefined
              }
              disabled={submitting}
            />
            {getError("avatar") && (
              <small className="p-error text-red-500">
                {getError("avatar")}
              </small>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="h-4"></div>
          </div>

          <div>
            <label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={submitting}
            />
            {getError("fullName") && (
              <small className="p-error text-red-500">
                {getError("fullName")}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
            {getError("email") && (
              <small className="p-error text-red-500">
                {getError("email")}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number</label>
            <InputText
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={submitting}
            />
            {getError("phoneNumber") && (
              <small className="p-error text-red-500">
                {getError("phoneNumber")}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <InputText
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              disabled={submitting}
            />
            {getError("password") && (
              <small className="p-error text-red-500">
                {getError("password")}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="roles">Roles</label>
            <MultiSelect
              id="roles"
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.value)}
              options={roleData}
              optionLabel="name"
              display="chip"
              placeholder="Select Roles"
              maxSelectedLabels={3}
              className="w-full"
              disabled={submitting}
            />
            {getError("roles") && (
              <small className="p-error text-red-500">
                {getError("roles")}
              </small>
            )}
          </div>

          <div className="col-span-1 md:col-span-2"></div>

          <div>
            <label htmlFor="province">
              Province <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="province"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.value)}
              options={provinceData}
              optionLabel="name"
              placeholder="Select a Province"
              className="w-full"
              disabled={submitting}
            />
            {getError("province") && (
              <small className="p-error text-red-500">
                {getError("province")}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="district">
              District <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.value)}
              options={districtData}
              optionLabel="name"
              placeholder="Select a District"
              className="w-full"
              disabled={submitting || !selectedProvince}
            />
            {getError("district") && (
              <small className="p-error text-red-500">
                {getError("district")}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="ward">
              Ward <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="ward"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.value)}
              options={wardData}
              optionLabel="name"
              placeholder="Select a Ward"
              className="w-full"
              disabled={submitting || !selectedDistrict}
            />
            {getError("ward") && (
              <small className="p-error text-red-500">{getError("ward")}</small>
            )}
          </div>
          <div>
            <label htmlFor="street">
              Street <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="street"
              value={selectedStreet}
              onChange={(e) => setSelectedStreet(e.value)}
              options={streetData}
              optionLabel="name"
              placeholder="Select a Street"
              className="w-full"
              disabled={submitting || !selectedWard}
            />
            {getError("street") && (
              <small className="p-error text-red-500">
                {getError("street")}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="streetNumber">
              Street Number <span className="text-red-500">*</span>
            </label>
            <InputText
              id="streetNumber"
              value={streetNumber}
              onChange={(e) => setStreetNumber(e.target.value)}
              disabled={submitting}
            />
            {getError("streetNumber") && (
              <small className="p-error text-red-500">
                {getError("streetNumber")}
              </small>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </label>
            <InputSwitch
              id="status"
              className="w-50"
              checked={status}
              onChange={(e) => setStatus(e.value)}
              disabled={submitting}
            />
            {getError("status") && (
              <small className="p-error text-red-500">
                {getError("status")}
              </small>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
