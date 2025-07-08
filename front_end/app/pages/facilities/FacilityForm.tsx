import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { useCommonData } from "~/hook/useCommonData";
import { useAppDispatch } from "~/store"; // Import useAppDispatch from your store
import { fetchCommonData } from "~/store/slice/commonDataSlice"; // Adjust path if needed
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
//Danh sách 20 icon phù hợp, không trùng lặp, chắc chắn hiển thị tốt với PrimeIcons
const hotelIcons = [
  { label: "WiFi", value: "pi pi-wifi" },
  { label: "Parking", value: "pi pi-car" },
  { label: "Swimming Pool", value: "pi pi-home" },
  { label: "Restaurant", value: "pi pi-shopping-cart" },
  { label: "Gym", value: "pi pi-heart" },
  { label: "Spa", value: "pi pi-star" },
  { label: "Bar", value: "pi pi-glass" },
  { label: "Room Service", value: "pi pi-bell" },
  { label: "Laundry", value: "pi pi-refresh" },
  { label: "Air Conditioning", value: "pi pi-snowflake" },
  { label: "TV", value: "pi pi-desktop" },
  { label: "Safe", value: "pi pi-lock" },
  { label: "Mini Bar", value: "pi pi-bolt" },
  { label: "Balcony", value: "pi pi-window-maximize" },
  { label: "Ocean View", value: "pi pi-eye" },
  { label: "Business Center", value: "pi pi-briefcase" },
  { label: "Conference Room", value: "pi pi-users" },
  { label: "Shuttle Service", value: "pi pi-send" },
  { label: "Security", value: "pi pi-shield" },
  { label: "Pet Friendly", value: "pi pi-paw" },
];
export default function FacilityForm({
  id,
  open,
  mode = "view",
  onClose,
  loadDataById,
  createItem,
  updateItem,
  error,
}: Props) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filteredIcons, setFilteredIcons] = useState(hotelIcons);

  const { commonData } = useCommonData(["facilitiestype"]);

  const facilitiesData = commonData.facilityTypes ?? [];

  const dispatch = useAppDispatch();

  const resetForm = () => {
    setName("");
    setIcon("");
    setType(null);
    setFilteredIcons(hotelIcons);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "edit" && id && facilitiesData.length > 0) {
        try {
          const data = await loadDataById(id);
          console.log("Data loaded:", data);

          setName(data.name || "");
          setIcon(data.icon || "");

          const matched = facilitiesData.find((t: any) =>
            typeof data.type === "object"
              ? t.id === data.type.id
              : t.id === data.type
          );
          setType(matched || null);
        } catch (err) {

          toast.error("Failed to load facility data", {
          autoClose:3000
          });
        }
      }

      if (mode === "create") {
        resetForm();
      }
    };

    if (open) {
      fetchData();
    }
  }, [id, open, mode, facilitiesData]);

  const submit = async () => {
    setSubmitting(true);
    const facilityDTO = { name, icon, type: type?.id };

    try {
      if (mode === "edit" && id) {
        await updateItem(id, facilityDTO);
        toast.success("Facility updated", {
          autoClose:3000
        });
        await dispatch(
          fetchCommonData({ types: ["facilitiestype"], force: true })
        );
      } else {
        await createItem(facilityDTO);
        toast.success("Facility created", {
          autoClose:3000
        });
      }

      onClose();
    } catch (err: any) {
        toast.error( err.message || "Failed to save facility", {
          autoClose:3000
        });
    } finally {
      setSubmitting(false);
    }
  };

  const getError = (field: string) =>
    (error && typeof error === "object" && (error as any)[field]) || null;

  const searchIcon = (event: any) => {
    const query = event.query.toLowerCase();
    const filtered = hotelIcons.filter((icon) =>
      icon.label.toLowerCase().includes(query) || icon.value.toLowerCase().includes(query)
    );
    setFilteredIcons(filtered);
  };

  const header = mode === "edit" ? "EDIT" : "ADD";

  return (
    <div>
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
              disabled={submitting}
              severity="success"
              className="btn_submit"
              loading={submitting}
              style={{ padding: "8px 40px" }}
            />
          </div>
        }
        style={{ width: "50%" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                getError("name") ? "p-invalid" : ""
              }`}
            />
            {getError("name") && (
              <small className="text-red-600 text-xs mt-1 block">
                {getError("name")}
              </small>
            )}
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="type"
              value={type}
              onChange={(e) => setType(e.value)}
              options={facilitiesData}
              optionLabel="name"
              placeholder="Select a type"
              style={{ width: "100%" }} // ✅ giữ
              className={`w-full border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                getError("type") ? "p-invalid" : ""
              }`} // ❌ bỏ p-2
              checkmark
              highlightOnSelect={false}
              disabled={submitting}
            />

            {getError("type") && (
              <small className="p-error text-red-500">{getError("type")}</small>
            )}
          </div>

          {/* Icon */}
          <div className="sm:col-span-2">
            <div className="w-full">
              <label
                htmlFor="icon"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Icon <span className="text-red-500">*</span>
              </label>
              <InputText
                id="icon"
                value={icon}
                onChange={e => setIcon(e.target.value)}
                placeholder="Type to search or enter custom icon class"
                className={`w-full border rounded-lg focus:ring-2 focus:ring-blue-500 ${getError("icon") ? "p-invalid" : ""}`}
                disabled={submitting}
                style={{ marginBottom: '8px' }}
              />
              {/* Grid icon */}
              <div className="grid grid-cols-5 gap-2 mb-2">
                {hotelIcons
                  .filter(i =>
                    !icon ||
                    i.label.toLowerCase().includes(icon.toLowerCase()) ||
                    i.value.toLowerCase().includes(icon.toLowerCase())
                  )
                  .map(i => (
                    <button
                      type="button"
                      key={i.value}
                      className={`flex flex-col items-center justify-center p-2 border rounded hover:bg-blue-100 transition-all ${icon === i.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => {
                        setIcon(i.value);
                        if (!name) setName(i.label);
                      }}
                      tabIndex={-1}
                      style={{ outline: 'none' }}
                    >
                      <i className={`${i.value} text-xl mb-1`} />
                      <span className="text-xs text-center whitespace-nowrap">{i.label}</span>
                    </button>
                  ))}
              </div>
              {icon && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <span>Preview:</span>
                  <i className={`${icon} text-lg`} />
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {icon}
                  </span>
                </div>
              )}
              {getError("icon") && (
                <small className="text-red-600 text-xs mt-1 block">
                  {getError("icon")}
                </small>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
