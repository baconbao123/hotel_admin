import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Tag } from "primereact/tag";
import { Image } from "antd";
import noImg from "@/asset/images/no-img.png";
import "./UserFrom.scss";
import { format } from "date-fns";

interface Props {
  id?: string;
  open: boolean;
  mode?: "create" | "edit" | "view";
  onClose: () => void;
  loadDataById: (id: string) => Promise<any>;
}

export default function UserDetail({
  id,
  open,
  mode = "view",
  onClose,
  loadDataById,
}: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [ward, setWard] = useState<string>("");
  const [roleData, setRoleData] = useState<any[]>([]);
  const [createdData, setCreatedData] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedData, setUpdatedData] = useState("");
  const [updateAt, setUpdateAt] = useState("");

  const toast = useRef<Toast>(null);

  const header = mode === "view" ? "ROLE DETAILS" : "";

  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then((data) => {
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setPhoneNumber(data.phoneNumber || "");
          setStatus(data.status ?? true);
          setAvatarUrl(data.avatarUrl || null);
          setStreet(data.streetName || "");
          setStreetNumber(data.streetNumber || "");
          setProvince(data.provinceName || "");
          setDistrict(data.districtName || "");
          setWard(data.wardName || "");
          setRoleData(data.roles);
          setCreatedAt(data.createdAt || "");
          setUpdateAt(data.updatedAt || "");
          setCreatedData(data.createdName || "");
          setUpdatedData(data.updatedName || "");
        })
        .catch((error: any) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || "Failed to load user data",
            life: 3000,
          });
        });
    }
  }, [id, open, loadDataById]);

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
              style={{ padding: "8px 40px" }}
            />
          </div>
        }
        style={{ width: "50%", zIndex: 1 }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-3 gap-2 items-center">
            <label htmlFor="avatar" className="font-bold col-span-1">
              Avatar:
            </label>
            <span id="avatar" className="col-span-2">
              {avatarUrl ? (
                <>
                  <Image
                    width={100}
                    src={`${
                      import.meta.env.VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
                    }/${avatarUrl}`}
                  />
                </>
              ) : (
                <div>
                  <Image src={noImg} width={60} />
                </div>
              )}
            </span>
          </div>

          <div></div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="name" className="font-bold col-span-1">
                Fullname:
              </label>
              <span id="name" className="col-span-2">
                {fullName || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="email" className="font-bold col-span-1">
                Email:
              </label>
              <span id="email" className="col-span-2">
                {email || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="phone" className="font-bold col-span-1">
                Phone number:
              </label>
              <span id="phone" className="col-span-2">
                {phoneNumber || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="role" className="font-bold col-span-1">
                Roles:
              </label>
              <span id="role" className="col-span-2">
                {roleData.length > 0 ? (
                  roleData.map((role, index) => (
                    <div key={index}>{role.roleName}</div>
                  ))
                ) : (
                  <div>-</div>
                )}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="status" className="font-bold col-span-1">
                Status:
              </label>
              <span id="status" className="col-span-2">
                <Tag
                  value={status ? "Active" : "Inactive"}
                  severity={status ? "success" : "danger"}
                />
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="createdName" className="font-bold col-span-1">
                Created By:
              </label>
              <span id="createdName" className="col-span-2">
                {createdData || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="createdAt" className="font-bold col-span-1">
                Created At:
              </label>
              <span id="createdAt" className="col-span-2">
                {createdAt
                  ? format(new Date(createdAt), "yyyy-MM-dd HH:mm:ss")
                  : "-"}
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="province" className="font-bold col-span-1">
                Province:
              </label>
              <span id="province" className="col-span-2">
                {province || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="district" className="font-bold col-span-1">
                District:
              </label>
              <span id="district" className="col-span-2">
                {district || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="ward" className="font-bold col-span-1">
                Ward:
              </label>
              <span id="ward" className="col-span-2">
                {ward || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="street" className="font-bold col-span-1">
                Street:
              </label>
              <span id="street" className="col-span-2">
                {street || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="streetNumber" className="font-bold col-span-1">
                Street Number:
              </label>
              <span id="streetNumber" className="col-span-2">
                {streetNumber || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="updatedName" className="font-bold col-span-1">
                Updated By:
              </label>
              <span id="updatedName" className="col-span-2">
                {updatedData || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label htmlFor="updatedAt" className="font-bold col-span-1">
                Updated At:
              </label>
              <span id="updatedAt" className="col-span-2">
                {updateAt
                  ? format(new Date(updateAt), "yyyy-MM-dd HH:mm:ss")
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
