import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import $axios from "@/axios";
import { useCommonData } from "@/hooks/useCommonData";

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

interface LocalResponse {
  code: string;
  name: string;
}

export default function StreetForm({
  id,
  open,
  mode = "create",
  onClose,
  loadDataById,
  createItem,
  updateItem,
  error,
}: Props) {
  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [curb, setCurb] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [streetData, setStreetData] = useState<any>(null);
  const [districtData, setDistrictData] = useState<LocalResponse[]>([]);
  const [wardData, setWardData] = useState<LocalResponse[]>([]);
  const [selectedProvince, setSelectedProvince] =
    useState<LocalResponse | null>(null);
  const [selectedDistrict, setSelectedDistrict] =
    useState<LocalResponse | null>(null);
  const [selectedWard, setSelectedWard] = useState<LocalResponse | null>(null);

  const toast = useRef<Toast>(null);
  const header = mode === "edit" ? "EDIT" : "ADD";

  const { commonData } = useCommonData(["provinces"]);

  const provinces = commonData.provinces ?? [];

  // Fetch districts when province is selected
  useEffect(() => {
    if (selectedProvince?.code) {
      const fetchDistricts = async () => {
        try {
          const res = await $axios.get(
            `/local/get-district?provinceCode=${selectedProvince.code}`
          );
          setDistrictData(res.data.result || []);
          if (streetData?.districtCode) {
            setSelectedDistrict(
              res.data.result.find(
                (district: any) => district.code === streetData.districtCode
              ) || null
            );
          } else {
            setSelectedDistrict(null);
          }
          setWardData([]);
          setSelectedWard(null);
        } catch (error: any) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || "Failed to load districts",
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
    }
  }, [selectedProvince, streetData]);

  // Fetch wards when district is selected
  useEffect(() => {
    if (selectedDistrict?.code) {
      const fetchWards = async () => {
        try {
          const res = await $axios.get(
            `/local/get-ward?districtCode=${selectedDistrict.code}`
          );
          const wards = res.data.result || [];
          setWardData(wards);
          if (streetData?.wardCode) {
            setSelectedWard(
              wards.find((ward: any) => ward.code === streetData.wardCode) ||
                null
            );
          } else {
            setSelectedWard(null);
          }
        } catch (error: any) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || "Failed to load wards",
            life: 3000,
          });
        }
      };
      fetchWards();
    } else {
      setWardData([]);
      setSelectedWard(null);
    }
  }, [selectedDistrict, streetData]);

  // Load street data for edit mode
  useEffect(() => {
    if (id && open && mode === "edit") {
      loadDataById(id)
        .then(async (response) => {
          const entity = response.entity;
          setStreetData(entity);
          setName(entity.name || "");
          setCurb(entity.curbWith || "");
          setWidth(entity.width || "");

          if (entity.wardCode) {
            try {
              const wardRes = await $axios.get(
                `/local/get-ward-info?wardCode=${entity.wardCode}`
              );
              const wardInfo = wardRes.data.result;
              if (wardInfo) {
                const { provinceCode, districtCode } = wardInfo;
                setStreetData((prev: any) => ({
                  ...prev,
                  provinceCode,
                  districtCode,
                  wardCode: entity.wardCode,
                }));

                const province =
                  provinces.find((p) => p.code === provinceCode) || null;
                setSelectedProvince(province);

                if (province) {
                  const districtRes = await $axios.get(
                    `/local/get-district?provinceCode=${provinceCode}`
                  );
                  const districts = districtRes.data.result || [];
                  setDistrictData(districts);

                  const district =
                    districts.find((d: any) => d.code === districtCode) || null;
                  setSelectedDistrict(district);
                }
              } else {
                toast.current?.show({
                  severity: "warn",
                  summary: "Warning",
                  detail: "Ward information not found",
                  life: 3000,
                });
              }
            } catch (error: any) {
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail:
                  error.response?.data?.message ||
                  "Failed to load ward information",
                life: 3000,
              });
            }
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail:
              error.response?.data?.message || "Failed to load street data",
            life: 3000,
          });
        });
    } else {
      setName("");
      setCurb("");
      setWidth("");
      setStreetData(null);
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setDistrictData([]);
      setWardData([]);
    }
  }, [id, open, mode, loadDataById]);

  const submit = async () => {
    setSubmitting(true);
    const streetsDTO = {
      name,
      wardCode: selectedWard?.code,
      width,
      curbWith: curb,
    };

    try {
      if (mode === "edit" && id) {
        await updateItem(id, streetsDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Street updated",
          life: 3000,
        });
      } else {
        await createItem(streetsDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Street created",
          life: 3000,
        });
      }
      onClose();
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to save street",
        life: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getError = (field: string) =>
    error &&
    typeof error === "object" &&
    (error as Record<string, string>)[field];

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
              className="btn_submit"
              loading={submitting}
              style={{ padding: "8px 40px" }}
            />
          </div>
        }
        style={{ width: "50%", maxWidth: "95vw" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="pl-4 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                disabled={mode === "view" || submitting}
                placeholder="Enter name"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  getError("name") ? "p-invalid" : ""
                }`}
                tooltip="Enter the name"
                tooltipOptions={{ position: "top" }}
              />
              {getError("name") && (
                <small className="text-red-600 text-xs mt-1 block">
                  {getError("name")}
                </small>
              )}
            </div>

            {/* Width */}
            <div>
              <label
                htmlFor="width"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Width
              </label>
              <InputText
                id="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                disabled={mode === "view" || submitting}
                placeholder="Enter width"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  getError("width") ? "p-invalid" : ""
                }`}
                tooltip="Enter the width of the entity"
                tooltipOptions={{ position: "top" }}
              />
              {getError("width") && (
                <small className="text-red-600 text-xs mt-1 block">
                  {getError("width")}
                </small>
              )}
            </div>

            {/* Curb */}
            <div>
              <label
                htmlFor="curb"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Curb
              </label>
              <InputText
                id="curb"
                value={curb}
                onChange={(e) => setCurb(e.target.value)}
                disabled={mode === "view" || submitting}
                placeholder="Enter curb"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  getError("curb") ? "p-invalid" : ""
                }`}
                tooltip="Enter the curb"
                tooltipOptions={{ position: "top" }}
              />
              {getError("curb") && (
                <small className="text-red-600 text-xs mt-1 block">
                  {getError("curb")}
                </small>
              )}
            </div>

            {/* Address Information */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Province */}
                <div>
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
                    options={provinces}
                    optionLabel="name"
                    placeholder="Select a Province"
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      getError("province") ? "p-invalid" : ""
                    }`}
                    disabled={mode === "view" || submitting}
                    tooltip="Select the province of the location"
                    tooltipOptions={{ position: "top" }}
                  />
                  {getError("province") && (
                    <small className="text-red-600 text-xs mt-1 block">
                      {getError("province")}
                    </small>
                  )}
                </div>

                {/* District */}
                <div>
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
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      getError("district") ? "p-invalid" : ""
                    }`}
                    disabled={
                      mode === "view" || submitting || !selectedProvince
                    }
                    tooltip="Select the district of the location"
                    tooltipOptions={{ position: "top" }}
                  />
                  {getError("district") && (
                    <small className="text-red-600 text-xs mt-1 block">
                      {getError("district")}
                    </small>
                  )}
                </div>

                {/* Ward */}
                <div>
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
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      getError("ward") ? "p-invalid" : ""
                    }`}
                    disabled={
                      mode === "view" || submitting || !selectedDistrict
                    }
                    tooltip="Select the ward of the location"
                    tooltipOptions={{ position: "top" }}
                  />
                  {getError("ward") && (
                    <small className="text-red-600 text-xs mt-1 block">
                      {getError("ward")}
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
