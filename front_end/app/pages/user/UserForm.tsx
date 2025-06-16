import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import styles from "@/pages/user/UserFrom.module.scss";
import ImageUploader from "@/utils/ImageUploader";
import { InputSwitch } from "primereact/inputswitch";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import $axios from "@/axios";
import { MultiSelect } from "primereact/multiselect";

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
  }, [id, open, loadDataById, provinceData]);

  const submitData = async (e: React.FormEvent) => {
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
      await loadDataTable();
      onClose();
    } catch (error: any) {
      let errorMessage = "Failed to save user";
      if (error.response?.data) {
        const { message, errors } = error.response.data;
        if (errors && typeof errors === "object") {
          errorMessage = Object.entries(errors)
            .map(([field, msg]) => `${msg}`)
            .join("; ");
        } else if (message) {
          errorMessage = message;
        }
      }
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 5000,
      });
      console.error("Error saving user:", error.response?.data || error);
    } finally {
      setSubmitting(false);
    }
  };

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
          </div>

          <div style={{ height: "10px" }}></div>

          <div className={styles.group_input}>
            <div className={styles.group_a}>
              <div className={styles.field_input}>Province</div>
              <div className={styles.input_enter}>
                <Dropdown
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.value)}
                  options={provinceData}
                  optionLabel="name"
                  placeholder="Select a Province"
                  className="w-full md:w-14rem"
                  disabled={mode === "view" || submitting}
                />
              </div>
            </div>

            <div className={styles.group_b}>
              <div className={styles.field_input}>District</div>
              <div className={styles.input_enter}>
                <Dropdown
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.value)}
                  options={districtData}
                  optionLabel="name"
                  placeholder="Select a District"
                  className="w-full md:w-14rem"
                  disabled={mode === "view" || submitting || !selectedProvince}
                />
              </div>
            </div>
          </div>

          <div style={{ height: "10px" }}></div>

          <div className={styles.group_input}>
            <div className={styles.group_a}>
              <div className={styles.field_input}>Ward</div>
              <div className={styles.input_enter}>
                <Dropdown
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.value)}
                  options={wardData}
                  optionLabel="name"
                  placeholder="Select a Ward"
                  className="w-full md:w-14rem"
                  disabled={mode === "view" || submitting || !selectedDistrict}
                />
              </div>
            </div>

            <div className={styles.group_b}>
              <div className={styles.field_input}>Street</div>
              <div className={styles.input_enter}>
                <Dropdown
                  value={selectedStreet}
                  onChange={(e) => setSelectedStreet(e.value)}
                  options={streetData}
                  optionLabel="name"
                  placeholder="Select a Street"
                  className="w-full md:w-14rem"
                  disabled={mode === "view" || submitting || !selectedWard}
                />
              </div>
            </div>

            <div className={styles.group_b}>
              <div className={styles.field_input}>Street Number</div>
              <div className={styles.input_enter}>
                <InputText
                  value={streetNumber}
                  onChange={(e) => setStreetNumber(e.target.value)}
                  disabled={mode === "view" || submitting}
                />
              </div>
            </div>
          </div>

          <div style={{ height: "10px" }}></div>

          <div className={styles.group_input}>
            <div className={styles.group_a}>
              <div className={styles.field_input}>Role</div>
              <div className={styles.input_enter}>
                <MultiSelect
                  value={selectedRoles}
                  onChange={(e) => setSelectedRoles(e.value)}
                  options={roleData}
                  optionLabel="name"
                  display="chip"
                  placeholder="Select Roles"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
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
