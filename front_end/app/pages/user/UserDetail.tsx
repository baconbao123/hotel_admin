import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Tag } from "primereact/tag";
import { Image } from "antd";
import noImg from "@/asset/images/no-img.png";
import "./UserForm.scss";
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
  const [roleData, setRoleData] = useState<any[]>([]);
  const [userType, setUserType] = useState<any>("");
  const [createdData, setCreatedData] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedData, setUpdatedData] = useState("");
  const [updateAt, setUpdateAt] = useState("");

  const toast = useRef<Toast>(null);

  const header = mode === "view" ? "DETAILS" : "";

  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then((data) => {
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setPhoneNumber(data.phoneNumber || "");
          setStatus(data.status ?? true);
          setAvatarUrl(data.avatarUrl || null);
          setRoleData(data.roles);
          setCreatedAt(data.createdAt || "");
          setUserType(data.userTypeName || "");
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
              severity="secondary"
              outlined
              label="Close"
              onClick={onClose}
              style={{ padding: "8px 40px" }}
            />
          </div>
        }
        style={{ width: "50%", zIndex: 1 }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="mb-3 pl-4 pr-4">
          <label htmlFor="avatar" className="font-bold block mb-1">
            Avatar:
          </label>
          <span id="avatar">
            {avatarUrl ? (
              <Image
                width={100}
                src={`${
                  import.meta.env.VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
                }/${avatarUrl}`}
                alt="User Avatar"
              />
            ) : (
              <Image src={noImg} width={60} alt="No Image" />
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 pr-4">
          {/* Left */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 items-center mb-2">
              <label htmlFor="name" className="font-bold block mb-1">
                Fullname:
              </label>
              <span id="name">{fullName || "-"}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center mb-2">
              <label htmlFor="email" className="font-bold block mb-1">
                Email:
              </label>
              <span id="email">{email || "-"}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center mb-2">
              <label htmlFor="phone" className="font-bold block mb-1">
                Phone number:
              </label>
              <span id="phone">{phoneNumber || "-"}</span>
            </div>
          </div>

          {/* Cột phải */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 items-center mb-2">
              <label htmlFor="role" className="font-bold block mb-1">
                User Type:
              </label>
              <span id="role">{userType ?? "-"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center mb-2">
              <label htmlFor="role" className="font-bold block mb-1">
                Roles:
              </label>
              <span id="role">
                {roleData.length > 0 ? (
                  roleData.map((role, index) => (
                    <div key={index}>{role.roleName}</div>
                  ))
                ) : (
                  <div>-</div>
                )}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center mb-2">
              <label htmlFor="status" className="font-bold block mb-1">
                Status:
              </label>
              <span id="status">
                <Tag
                  value={status ? "Active" : "Inactive"}
                  severity={status ? "success" : "danger"}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Info data create/update */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-4 pr-4">
          {/* Left */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 items-center mb-2">
              <label htmlFor="createdName" className="font-bold block mb-1">
                Created By:
              </label>
              <span id="createdName">{createdData || "-"}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center mb-2">
              <label htmlFor="createdAt" className="font-bold block mb-1">
                Created At:
              </label>
              <span id="createdAt">
                {createdAt
                  ? format(new Date(createdAt), "yyyy-MM-dd HH:mm:ss")
                  : "-"}
              </span>
            </div>
          </div>
          {/* Right */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 items-center mb-2">
              <label htmlFor="updatedName" className="font-bold block mb-1">
                Updated By:
              </label>
              <span id="updatedName">{updatedData || "-"}</span>
            </div>

            <div  className="grid grid-cols-3 gap-2 items-center mb-2">
              <label htmlFor="createdAt" className="font-bold block mb-1">
                Update At:
              </label>
              <span id="createdAt">
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
