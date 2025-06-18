import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import $axios from "@/axios";

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
  const [provinceData, setProvinceData] = useState<LocalResponse[]>([]);
  const [districtData, setDistrictData] = useState<LocalResponse[]>([]);
  const [wardData, setWardData] = useState<LocalResponse[]>([]);
  const [selectedProvince, setSelectedProvince] =
    useState<LocalResponse | null>(null);
  const [selectedDistrict, setSelectedDistrict] =
    useState<LocalResponse | null>(null);
  const [selectedWard, setSelectedWard] = useState<LocalResponse | null>(null);

  const toast = useRef<Toast>(null);
  const header = mode === "edit" ? "EDIT STREET" : "ADD NEW STREET";

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await $axios.get("/local/get-province");
        setProvinceData(res.data.result || []);
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

          if (entity.wardCode && provinceData.length > 0) {
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
                  provinceData.find((p) => p.code === provinceCode) || null;
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
  }, [id, open, mode, loadDataById, provinceData]);

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
            {mode !== "view" && (
              <Button
                label="Save"
                onClick={submit}
                severity="success"
                disabled={
                  submitting ||
                  !name ||
                  !selectedProvince ||
                  !selectedDistrict ||
                  !selectedWard
                }
                loading={submitting}
                style={{ padding: "8px 40px" }}
              />
            )}
          </div>
        }
        style={{ width: "40%" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label htmlFor="street">
              Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="street"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mode === "view" || submitting}
            />
            {getError("name") && (
              <small className="p-error text-red-500">{getError("name")}</small>
            )}
          </div>

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
              disabled={mode === "view" || submitting}
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
              disabled={mode === "view" || submitting || !selectedProvince}
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
              disabled={mode === "view" || submitting || !selectedDistrict}
            />
            {getError("ward") && (
              <small className="p-error text-red-500">{getError("ward")}</small>
            )}
          </div>

          <div>
            <label htmlFor="width">Width</label>
            <InputText
              id="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              disabled={mode === "view" || submitting}
            />
            {getError("width") && (
              <small className="p-error text-red-500">
                {getError("width")}
              </small>
            )}
          </div>

          <div>
            <label htmlFor="curb">Curb</label>
            <InputText
              id="curb"
              value={curb}
              onChange={(e) => setCurb(e.target.value)}
              disabled={mode === "view" || submitting}
            />
            {getError("curb") && (
              <small className="p-error text-red-500">{getError("curb")}</small>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
