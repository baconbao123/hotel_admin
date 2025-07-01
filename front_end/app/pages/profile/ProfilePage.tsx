import { useEffect, useState } from "react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Image } from "antd";
import noImg from "@/asset/images/no-img.png";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import $axios from "@/axios";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [viewEditPassword, setViewEditPassword] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [crrPasswrod, setCrrPassword] = useState("");
  const [mess, setMess] = useState("");

  const user = useSelector((state: RootState) => state.userData);

  if (editing) {
    return <EditProfile onBack={() => setEditing(false)} />;
  }

  const handleChangePass = async () => {
    try {
      const res = await $axios.post(
        `/auth/change-password-profile?email=${user.email}&oldPassword=${crrPasswrod}`
      );

      if (res.data.message) {
        setMess(res.data.message);
      }
    } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-xl p-8">
        <div className="flex items-center space-x-6 mb-6">
          {user.avatarUrl && user.avatarUrl.trim() !== "" ? (
            <Image
              width={50}
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible,
              }}
              src={`${
                import.meta.env.VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
              }/${user.avatarUrl}`}
            />
          ) : (
            <Image
              width={50}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible,
              }}
              src={noImg}
            />
          )}

          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.fullname}
            </h2>
            {user?.roles?.map((r: any) => (
              <p className="text-sm text-gray-500">{r}1</p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Email</p>
            <div className="flex justify-start items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-800">{user.email}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Role</p>
            {user.roles.map((r: any) => (
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-800">{r}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Phone Number</p>
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-800">
                {user.phoneNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8  flex gap-2">
          <Button
            severity="success"
            style={{ color: "white", fontWeight: "600" }}
            onClick={() => setViewEditPassword(true)}
          >
            Password
          </Button>

          <Button
            severity="info"
            onClick={() => setEditing(true)}
            style={{ color: "white", fontWeight: "600" }}
          >
            Edit Profile
          </Button>
        </div>

        {viewEditPassword && (
          <Dialog
            header="Confirm Password"
            visible={viewEditPassword}
            style={{ width: "20vw" }}
            footer={
              <div className="flex justify-center gap-2">
                <Button
                  label="Close"
                  onClick={() => setViewEditPassword(false)}
                  severity="secondary"
                  outlined
                  className="px-6 py-2 rounded-lg"
                />
                <Button
                  label="Submit"
                  onClick={handleChangePass}
                  severity="success"
                  className="px-6 py-2 rounded-lg"
                />
              </div>
            }
            onHide={() => {
              if (!viewEditPassword) return;
              setViewEditPassword(false);
            }}
          >
            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 flex gap-5"
              >
                Current Password
                <span className="text-red-500">*</span>
              </label>
              <InputText
                id="confirmPassword"
                value={crrPasswrod}
                onChange={(e) => setCrrPassword(e.target.value)}
                type="password"
                className="w-95"
              />
            </div>
            <div style={{ color: "green" }}>{mess}</div>
          </Dialog>
        )}
      </div>
    </div>
  );
}
