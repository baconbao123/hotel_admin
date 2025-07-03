import { useState, useEffect, useRef, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import $axios from "@/axios";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import ImageUploader from "@/utils/ImageUploader";
import GalleryUploader from "@/utils/GalleryUploader";
import { FileUpload } from "primereact/fileupload";
import { useCommonData } from "@/hooks/useCommonData";
import type { RcFile } from "antd/es/upload";

interface Props {
  hotelId: any;
  id?: string;
  open: boolean;
  mode?: "create" | "edit" | "view";
  onClose: () => void;
  loadDataById: (id: string) => Promise<any>;
  createItem: (data: object | FormData) => Promise<any>;
  updateItem: (id: string, data: object | FormData) => Promise<any>;
  error: Object | null;
}

export default function BookingForm({
  hotelId,
  id,
  open,
  mode = "create",
  onClose,
  loadDataById,
  createItem,
  updateItem,
  error,
}: Props) {
  const [description, setDescription] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [roomArea, setRoomArea] = useState("");
  const [priceHour, setPriceHour] = useState("");
  const [priceNight, setPriceNight] = useState("");
  const [limit, setLmit] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedFacilies, setSelectedFacilies] = useState<number[]>([]);
  const [status, setStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const toast = useRef<Toast>(null);

  const { commonData } = useCommonData(["roomtypes", "hotelfacilities"]);

  const roomTypes = commonData.roomTypes;
  const hotelFacilities = commonData.hotelFacilities;

  const header = mode === "edit" ? "EDIT" : "ADD";

  const getError = (field: string) =>
    error &&
    typeof error === "object" &&
    (error as Record<string, string>)[field];

  const submit = async () => {
    setSubmitting(true);

    const formData = new FormData();

    // Basic info
    formData.append("description", description || "");
    formData.append("status", JSON.stringify(status));
    formData.append("roomNumber", roomNumber);
    formData.append("roomArea", roomArea);
    formData.append("hotelId", hotelId);
    formData.append("priceHour", priceHour);
    formData.append("priceNight", priceNight);
    formData.append("limitPerson", limit);

    // Facilities
    selectedFacilies.forEach((facilityId) => {
      if (typeof facilityId === "number" && !isNaN(facilityId)) {
        formData.append("facilities", facilityId.toString());
      } else {
        console.log("Invalid facility ID:", facilityId);
      }
    });

    try {
      if (id) {
        await updateItem(id, formData);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Hotel updated successfully",
          life: 3000,
        });
      } else {
        await createItem(formData);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Hotel created successfully",
          life: 3000,
        });
      }
      onClose();
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to save hotel",
        life: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Updated useEffect for loading hotel data
  useEffect(() => {
    if (id && open) {
      loadDataById(id).then(async (data) => {
        const result = data.result || data;

        setDescription(result.description || "");
        setStatus(result.status ?? true);
      });
    } else {
      setDescription("");
      setSelectedFacilies([]);
      setStatus(true);
      setSelectedType(null);
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
              outlined
              disabled={submitting}
              style={{ padding: "8px 40px" }}
            />
            <Button
              label="Save"
              onClick={submit}
              severity="success"
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
                Basic Information
              </h3>
            </div>

            {/* Infor */}
            <div className="col-span-12 md:col-span-12">
              {/* Name + Desc */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>

                  {getError("name") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("name")}
                    </small>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <InputText
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={submitting}
                    className={`w-full p-2 border rounded-lg ${
                      getError("description") ? "p-invalid" : ""
                    }`}
                  />
                  {getError("description") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("description")}
                    </small>
                  )}
                </div>
              </div>

              {/* Room number + area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Room Number <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="name"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    disabled={submitting}
                    className={`w-full p-2 border rounded-lg ${
                      getError("name") ? "p-invalid" : ""
                    }`}
                  />
                  {getError("name") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("name")}
                    </small>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Room Area <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="description"
                    value={roomArea}
                    onChange={(e) => setRoomArea(e.target.value)}
                    disabled={submitting}
                    className={`w-full p-2 border rounded-lg ${
                      getError("description") ? "p-invalid" : ""
                    }`}
                  />
                  {getError("description") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("description")}
                    </small>
                  )}
                </div>
              </div>

              {/* Room type + Room Facilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Room Type <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    id="typeIds"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.value)}
                    options={roomTypes}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select Room Type"
                    className={`w-full ${
                      getError("typeIds") ? "p-invalid" : ""
                    }`}
                  />

                  {getError("typeIds") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("typeIds")}
                    </small>
                  )}
                </div>

                {/* Facilities */}
                <div>
                  <label
                    htmlFor="facilities"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Room Facilities <span className="text-red-500">*</span>
                  </label>
                  <MultiSelect
                    value={selectedFacilies}
                    onChange={(e) => {
                      setSelectedFacilies(e.value);
                    }}
                    options={hotelFacilities || []}
                    optionLabel="name"
                    optionValue="id"
                    display="chip"
                    placeholder="Select Facilities"
                    maxSelectedLabels={3}
                    className={`w-full ${
                      getError("facilities") ? "p-invalid" : ""
                    }`}
                    disabled={submitting}
                  />
                  {getError("facilities") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("facilities")}
                    </small>
                  )}
                </div>
              </div>

              {/* Price Hour + Price Night */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price Hour <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="name"
                    value={priceHour}
                    onChange={(e) => setPriceHour(e.target.value)}
                    disabled={submitting}
                    className={`w-full p-2 border rounded-lg ${
                      getError("name") ? "p-invalid" : ""
                    }`}
                  />
                  {getError("name") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("name")}
                    </small>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price Night <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="description"
                    value={priceNight}
                    onChange={(e) => setPriceNight(e.target.value)}
                    disabled={submitting}
                    className={`w-full p-2 border rounded-lg ${
                      getError("description") ? "p-invalid" : ""
                    }`}
                  />
                  {getError("description") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("description")}
                    </small>
                  )}
                </div>
              </div>

              {/* Limit + Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Limit <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="name"
                    value={limit}
                    onChange={(e) => setLmit(e.target.value)}
                    disabled={submitting}
                    className={`w-full p-2 border rounded-lg ${
                      getError("name") ? "p-invalid" : ""
                    }`}
                  />
                  {getError("name") && (
                    <small className="text-red-500 text-xs mt-1">
                      {getError("name")}
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
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
