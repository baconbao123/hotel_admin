import { useState, useEffect, useRef, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import $axios from "~/axios";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import ImageUploader from "~/utils/ImageUploader";
import GalleryUploader from "~/utils/GalleryUploader";
import { FileUpload } from "primereact/fileupload";
import { useCommonData } from "~/hook/useCommonData";

import type { RcFile } from "antd/es/upload";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "~/store";
import {
  fetchCommonData,
  type CommonData,
} from "~/store/slice/commonDataSlice";
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

interface LocalResponse {
  code: string;
  name: string;
}

export default function HotelForm({
  id,
  open,
  mode = "create",
  onClose,
  loadDataById,
  createItem,
  updateItem,
  error,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);
  const [selectedImgsFile, setSelectedImgsFile] = useState<RcFile[]>([]);
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [selectedFacilies, setSelectedFacilies] = useState<number[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [keepAvatar, setKeepAvatar] = useState("true");
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [hotelData, setHotelData] = useState<any>(null);
  const [districtData, setDistrictData] = useState<LocalResponse[]>([]);
  const [wardData, setWardData] = useState<LocalResponse[]>([]);
  const [streetData, setStreetData] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] =
    useState<LocalResponse | null>(null);
  const [selectedDistrict, setSelectedDistrict] =
    useState<LocalResponse | null>(null);
  const [selectedWard, setSelectedWard] = useState<LocalResponse | null>(null);
  const [selectedStreet, setSelectedStreet] = useState<any>(null);
  const [hotelNote, setHotelNote] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [documents, setDocuments] = useState<any>([
    {
      documentId: null,
      documentName: "",
      typeId: null,
      documentUrl: null,
      existingDocumentUrl: null,
      keepDocument: true,
    },
  ]);
  const [policyId, setPolicyId] = useState("0");
  const [policyName, setPolicyName] = useState("");
  const [policyDescription, setPolicyDescription] = useState("");
  const [ownerId, setOwnerId] = useState<any>(null);
  const [keyword, setKeyword] = useState("");
  const [owners, setOwners] = useState<any>([]);
  const [hasMoreOwners, setHasMoreOwners] = useState(true);
  const [pageOwner, setPageOwner] = useState(0);

  const { commonData } = useCommonData([
    "provinces",
    "hoteltypes",
    "hotelfacilities",
    "hoteldocuments",
  ]);

  const provinces = commonData.provinces;
  const hotelTypes = commonData.hotelTypes;
  const hotelFacilities = commonData.hotelFacilities;
  const hotelDocuments = commonData.documentTypes;

  const dispatch: AppDispatch = useDispatch();

  const loadOwners = async (keyword = "", page = 0) => {
    const result = await dispatch(
      fetchCommonData({
        types: ["owners"],
        force: true,
        params: { keyword, pageOwner: page },
      })
    );

    const res = result.payload as CommonData;
    const newOwners: any = res.owners || [];

    if (page === 0) {
      setOwners(newOwners);
    } else {
      setOwners((prev: any) => [...prev, ...newOwners]);
    }

    setHasMoreOwners(newOwners.length === 20);
  };

  useEffect(() => {
    loadOwners();
  }, []);

  const header = mode === "edit" ? "EDIT" : "ADD";

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      {
        documentId: null,
        documentName: "",
        typeId: null,
        documentUrl: null,
        existingDocumentUrl: null,
        keepDocument: mode === "edit", // Default to false for create mode
      },
    ]);
  };

  const removeDocument = (index: any) => {
    setDocuments(documents.filter((_: any, i: any) => i !== index));
  };

  const updateDocument = (index: any, field: any, value: any) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index][field] = value;
    if (field === "keepDocument" && value === true) {
      updatedDocuments[index].documentUrl = null;
    }
    setDocuments(updatedDocuments);
  };

  const getError = (field: string) =>
    error &&
    typeof error === "object" &&
    (error as Record<string, string>)[field];

  const submit = async () => {
    setSubmitting(true);

    const formData = new FormData();

    // Basic info
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("status", JSON.stringify(status));

    // Address
    formData.append("streetNumber", streetNumber || "");
    formData.append(
      "streetId",
      selectedStreet?.id ? selectedStreet.id.toString() : ""
    );
    formData.append("wardCode", selectedWard?.code || "");
    formData.append("districtCode", selectedDistrict?.code || "");
    formData.append("provinceCode", selectedProvince?.code || "");
    formData.append("note", note || "");
    formData.append("noteHotel", hotelNote || "");
    formData.append("ownerId", ownerId?.id || "");

    // Avatar
    formData.append("avatar.keepAvatar", keepAvatar);
    if (keepAvatar === "false" && selectedFile) {
      formData.append("avatar.avatarUrl", selectedFile, selectedFile.name);
    } else if (keepAvatar === "true" && avatarUrl) {
      formData.append("avatar.existingAvatarUrl", avatarUrl);
    }

    // Images
    selectedImgsFile.forEach((file, index) => {
      formData.append(`images[${index}].imageFile`, file, file.name);
    });

    // Existing Images
    existingImages.forEach((img, index) => {
      formData.append(
        `images[${selectedImgsFile.length + index}].imageId`,
        img.id.toString()
      );
      formData.append(
        `images[${selectedImgsFile.length + index}].existingImageUrl`,
        img.imagesUrl
      );
    });

    // Facilities
    selectedFacilies.forEach((facilityId) => {
      if (typeof facilityId === "number" && !isNaN(facilityId)) {
        formData.append("facilities", facilityId.toString());
      } else {
        console.error("Invalid facility ID:", facilityId);
      }
    });

    // Types
    selectedTypes.forEach((typeId) => {
      if (typeof typeId === "number" && !isNaN(typeId)) {
        formData.append("typeIds", typeId.toString());
      } else {
        console.error("Invalid type ID:", typeId);
      }
    });

    // Documents
    documents.forEach((doc: any, index: any) => {
      if (doc.documentName && doc.typeId !== null && doc.typeId !== undefined) {
        // Common fields for both create and edit
        formData.append(`documents[${index}].documentName`, doc.documentName);
        formData.append(`documents[${index}].typeId`, doc.typeId.toString());

        // Fields specific to edit mode
        if (id && doc.documentId != null) {
          formData.append(
            `documents[${index}].documentId`,
            doc.documentId.toString()
          );
        }
        if (id && doc.keepDocument && doc.existingDocumentUrl) {
          formData.append(
            `documents[${index}].keepDocument`,
            doc.keepDocument.toString()
          );
          formData.append(
            `documents[${index}].existingDocumentUrl`,
            doc.existingDocumentUrl
          );
        } else if (doc.documentUrl instanceof File) {
          formData.append(
            `documents[${index}].documentUrl`,
            doc.documentUrl,
            doc.documentUrl.name
          );
        }
      } else {
        console.warn(`Skipping invalid document at index ${index}:`, doc);
      }
    });

    // Policy
    if (policyName && policyDescription) {
      formData.append("policy.policyId", policyId);
      formData.append("policy.policyName", policyName);
      formData.append("policy.policyDescription", policyDescription);
    }

    try {
      if (id) {
        await updateItem(id, formData);
        toast.success("Hotel updated successfully", {
          autoClose: 3000,
        });
      } else {
        await createItem(formData);
        toast.success("Hotel created successfully", {
          autoClose: 3000,
        });
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save hotel", {
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // fetch by id
  useEffect(() => {
    if (id && open) {
      loadDataById(id)
        .then(async (data) => {
          setHotelData(data);
          const result = data.result || data;

          // Set basic information
          setName(result.name || "");
          setDescription(result.description || "");
          setStatus(result.status ?? true);
          setNote(result.note || "");
          setStreetNumber(result.streetNumber || "");

          // Set hotel types
          if (result.typeHotels && hotelTypes) {
            const selectedTypeIds = hotelTypes
              .filter((option: any) =>
                result.typeHotels.some((type: any) => type?.id === option.id)
              )
              .map((type: any) => type.id)
              .filter((id: number) => typeof id === "number" && !isNaN(id));
            setSelectedTypes(selectedTypeIds);
          } else {
            setSelectedTypes([]);
          }

          // Set facilities
          const validHotelFacilities = Array.isArray(hotelFacilities)
            ? hotelFacilities.filter(
                (facility: any) =>
                  facility &&
                  typeof facility.id === "number" &&
                  !isNaN(facility.id) &&
                  facility.name
              )
            : [];
          if (result.facilities && validHotelFacilities.length) {
            const selectedFacilityIds = validHotelFacilities
              .filter((option: any) =>
                result.facilities.some(
                  (facility: any) => facility.id === option.id
                )
              )
              .map((facility: any) => facility.id)
              .filter((id: number) => typeof id === "number" && !isNaN(id));
            setSelectedFacilies(selectedFacilityIds);
          } else {
            setSelectedFacilies([]);
          }

          // owner
          const ownerId = owners.find(
            (o: any) => o.id === result.ownerId || null
          );

          setOwnerId(ownerId);

          setHotelNote(result.hotelNote);

          // Set documents
          if (result.documents && hotelDocuments) {
            setDocuments(
              result.documents?.map((doc: any) => ({
                documentId: doc.documentId,
                documentName: doc.documentName,
                typeId: doc.typeId,
                documentUrl: null,
                existingDocumentUrl: doc.documentUrl,
                keepDocument: true,
              })) || [
                {
                  documentId: null,
                  documentName: "",
                  typeId: null,
                  documentUrl: null,
                  existingDocumentUrl: null,
                  keepDocument: true,
                },
              ]
            );
          } else {
            setDocuments([
              {
                documentId: null,
                documentName: "",
                typeId: null,
                documentUrl: null,
                existingDocumentUrl: null,
                keepDocument: true,
              },
            ]);
          }

          // Set policies
          if (result.policies) {
            setPolicyId(result.policies.id?.toString() || "0");
            setPolicyName(result.policies.policyName || "");
            setPolicyDescription(result.policies.policyDescription || "");
          } else {
            setPolicyId("0");
            setPolicyName("");
            setPolicyDescription("");
          }

          // Set avatar
          if (result.avatarUrl) {
            setAvatarUrl(result.avatarUrl);
            setKeepAvatar("true");
            setSelectedFile(null);
          } else {
            setAvatarUrl(null);
            setKeepAvatar("false");
            setSelectedFile(null);
          }

          // Set gallery images
          const images = result.images
            ? result.images
                .filter((img: any) => {
                  if (!img?.imagesUrl || typeof img.imagesUrl !== "string") {
                    console.warn("Invalid image data:", img);
                    return false;
                  }
                  return true;
                })
                .map((img: any) => ({
                  id: img.id,
                  imagesUrl: img.imagesUrl,
                }))
            : [];
          setExistingImages(images);

          // Set address fields
          try {
            const province =
              provinces?.find(
                (p: LocalResponse) => p.code === result.provinceCode
              ) || null;
            setSelectedProvince(province);

            let districts: LocalResponse[] = [];
            let district: LocalResponse | null = null;
            if (province) {
              const districtRes = await $axios.get(
                `/local/get-district?provinceCode=${province.code}`
              );
              districts = districtRes.data.result || [];
              setDistrictData(districts);
              district =
                districts.find(
                  (d: LocalResponse) => d.code === result.districtCode
                ) || null;
              setSelectedDistrict(district);
            } else {
              setDistrictData([]);
              setSelectedDistrict(null);
            }

            let wards: LocalResponse[] = [];
            let ward: LocalResponse | null = null;
            if (district) {
              const wardRes = await $axios.get(
                `/local/get-ward?districtCode=${district.code}`
              );
              wards = wardRes.data.result || [];
              setWardData(wards);
              ward =
                wards.find((w: LocalResponse) => w.code === result.wardCode) ||
                null;
              setSelectedWard(ward);
            } else {
              setWardData([]);
              setSelectedWard(null);
            }

            let streets: any[] = [];
            let street: any = null;
            if (ward) {
              const streetRes = await $axios.get(
                `/local/get-street?wardCode=${ward.code}`
              );
              streets = streetRes.data.result || [];
              setStreetData(streets);
              street =
                streets.find((s: any) => s.id === result.streetId) || null;
              setSelectedStreet(street);
            } else {
              setStreetData([]);
              setSelectedStreet(null);
            }
          } catch (error: any) {
            console.error("Address fetch error:", error);
            toast.error(
              error.response?.data?.message || "Failed to load address data",
              {
                autoClose: 3000,
              }
            );
            setDistrictData([]);
            setSelectedDistrict(null);
            setWardData([]);
            setSelectedWard(null);
            setStreetData([]);
            setSelectedStreet(null);
          }
        })
        .catch((err) => {
          console.error("Error loading hotel data:", err);
          toast.error(
            err.response?.data?.message || "Failed to load districts",
            {
              autoClose: 3000,
            }
          );
        });
    } else {
      // Reset form for create mode
      setName("");
      setDescription("");
      setSelectedFacilies([]);
      setStatus(true);
      setSelectedTypes([]);
      setSelectedImgsFile([]);
      setSelectedFile(null);
      setAvatarUrl(null);
      setKeepAvatar("false");
      setExistingImages([]);
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setSelectedStreet(null);
      setStreetNumber("");
      setNote("");
      setDocuments([
        {
          documentId: null,
          documentName: "",
          typeId: null,
          documentUrl: null,
          existingDocumentUrl: null,
          keepDocument: false, // Default to false for create mode
        },
      ]);
      setPolicyId("0");
      setPolicyName("");
      setPolicyDescription("");
      setDistrictData([]);
      setWardData([]);
      setStreetData([]);
    }
  }, [id, open, loadDataById]);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince?.code) {
      const fetchDistricts = async () => {
        try {
          const res = await $axios.get(
            `/local/get-district?provinceCode=${selectedProvince.code}`
          );
          const districts = res.data.result || [];
          setDistrictData(districts);

          // Chỉ cập nhật selectedDistrict nếu cần
          if (hotelData?.result?.districtCode) {
            const district =
              districts.find(
                (d: LocalResponse) => d.code === hotelData.result.districtCode
              ) || null;
            if (district?.code !== selectedDistrict?.code) {
              setSelectedDistrict(district);
            }
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Failed to load districts",
            {
              autoClose: 3000,
            }
          );
        }
      };
      fetchDistricts();
    } else {
      setDistrictData([]);
      if (selectedDistrict) {
        setSelectedDistrict(null);
      }
    }
  }, [selectedProvince?.code, hotelData?.result?.districtCode]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict?.code) {
      const fetchWards = async () => {
        try {
          const res = await $axios.get(
            `/local/get-ward?districtCode=${selectedDistrict.code}`
          );
          const wards = res.data.result || [];
          setWardData(wards);
          // Set selectedWard based on wardCode if available
          if (hotelData?.result?.wardCode) {
            const ward =
              wards.find(
                (w: LocalResponse) => w.code === hotelData.result.wardCode
              ) || null;
            setSelectedWard(ward);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to load wards", {
            autoClose: 3000,
          });
        }
      };
      fetchWards();
    } else {
      setWardData([]);
      setSelectedWard(null);
    }
  }, [selectedDistrict, hotelData?.result?.wardCode]);

  // Fetch streets when ward changes
  useEffect(() => {
    if (selectedWard?.code) {
      const fetchStreets = async () => {
        try {
          const res = await $axios.get(
            `/local/get-street?wardCode=${selectedWard.code}`
          );
          const streets = res.data.result || [];
          setStreetData(streets);
          // Set selectedStreet based on streetId if available
          if (hotelData?.result?.streetId) {
            const street =
              streets.find((s: any) => s.id === hotelData.result.streetId) ||
              null;
            setSelectedStreet(street);
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Failed to load streets",
            {
              autoClose: 3000,
            }
          );
        }
      };
      fetchStreets();
    } else {
      setStreetData([]);
      setSelectedStreet(null);
    }
  }, [selectedWard, hotelData?.result?.streetId]);

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

            <div className="col-span-12 md:col-span-6">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                Room Avatar
              </h4>
              <div className="border rounded-lg p-4 bg-gray-50">
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Upload 1 image
                </label>
                <ImageUploader
                  initialImageUrl={
                    mode === "create" || !avatarUrl
                      ? undefined
                      : `${
                          import.meta.env.VITE_REACT_APP_BACK_END_UPLOAD_HOTEL
                        }/${avatarUrl}`
                  }
                  onFileChange={(file) => setSelectedFile(file)}
                  disabled={submitting}
                />
                {getError("avatar") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("avatar")}
                  </small>
                )}
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                Hotel Gallery
              </h4>
              <div className="border rounded-lg p-4 bg-gray-50">
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image (Up to 3)
                </label>
                <GalleryUploader
                  initialImageUrls={existingImages.map(
                    (img) =>
                      `${
                        import.meta.env.VITE_REACT_APP_BACK_END_UPLOAD_HOTEL
                      }/${img.imagesUrl}`
                  )}
                  onFilesChange={(files) => setSelectedImgsFile(files)}
                  onRemoveExistingImage={handleRemoveExistingImage}
                  disabled={submitting}
                  maxCount={3}
                />
                {getError("avatar.avatarUrl") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("avatar.avatarUrl")}
                  </small>
                )}
              </div>
            </div>

            <div className="col-span-12 md:col-span-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Hotel Type <span className="text-red-500">*</span>
                    </label>
                    <MultiSelect
                      id="typeIds"
                      value={selectedTypes}
                      onChange={(e) => {
                        console.log("Selected Types Changed:", e.value);
                        setSelectedTypes(e.value);
                      }}
                      options={hotelTypes || []}
                      optionLabel="name"
                      optionValue="id"
                      display="chip"
                      placeholder="Select Hotel Type"
                      className={`w-full ${
                        getError("typeIds") ? "p-invalid" : ""
                      }`}
                      disabled={submitting}
                    />
                    {getError("typeIds") && (
                      <small className="text-red-500 text-xs mt-1">
                        {getError("typeIds")}
                      </small>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="facilities"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Hotel Facilities
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
              </div>

              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Owner
                    </label>
                    <Dropdown
                      value={ownerId}
                      onChange={(e) => setOwnerId(e.value)}
                      options={owners}
                      optionLabel="fullName"
                      placeholder="Select owner"
                      className="w-full md:w-14rem"
                      filter
                      showClear
                      virtualScrollerOptions={{
                        lazy: true,
                        onLazyLoad: (e: any) => {
                          const nextPage = Math.floor(e.first / 20);
                          if (hasMoreOwners) {
                            setPageOwner(nextPage);
                            loadOwners(keyword, nextPage);
                          }
                        },
                        itemSize: 36,
                      }}
                      onFilter={(e: any) => {
                        const value = e.filter || "";
                        setKeyword(value);
                        setPageOwner(0);
                        loadOwners(value, 0);
                      }}
                      filterBy="fullName"
                    />
                    {getError("ownerId") && (
                      <small className="text-red-500 text-xs mt-1">
                        {getError("ownerId")}
                      </small>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="facilities"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Hotel Note
                    </label>
                    <InputText
                      id="name"
                      value={hotelNote}
                      onChange={(e) => setHotelNote(e.target.value)}
                      disabled={submitting}
                      className={`w-full p-2 border rounded-lg ${
                        getError("hotelNote") ? "p-invalid" : ""
                      }`}
                    />
                    {getError("hotelNote") && (
                      <small className="text-red-500 text-xs mt-1">
                        {getError("hotelNote")}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Document & Policy Information
              </h3>
            </div>

            <div className="col-span-12">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                Documents
              </h4>
              {id && hotelData?.result?.documents?.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Current Documents
                  </h5>
                  <ul>
                    {hotelData.result.documents.map((doc: any) => {
                      const fileUrl = `${
                        import.meta.env.VITE_REACT_APP_BACK_END_UPLOAD_DOCUMENT
                      }/${doc.documentUrl}`;
                      return (
                        <li key={doc.documentId}>
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                            onError={() =>
                              toast.error(
                                `Failed to load document: ${doc.documentName}`,
                                {
                                  autoClose: 3000,
                                }
                              )
                            }
                          >
                            {doc.documentName} ({doc.typeName})
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {documents.map((doc: any, index: any) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 mb-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor={`documentName-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Document Name <span className="text-red-500">*</span>
                      </label>
                      <InputText
                        id={`documentName-${index}`}
                        value={doc.documentName}
                        onChange={(e) =>
                          updateDocument(index, "documentName", e.target.value)
                        }
                        disabled={submitting}
                        className={`w-full p-2 border rounded-lg ${
                          getError(`documents`) ? "p-invalid" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`documentType-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Document Type <span className="text-red-500">*</span>
                      </label>
                      <Dropdown
                        id={`documentType-${index}`}
                        value={doc.typeId}
                        onChange={(e) =>
                          updateDocument(index, "typeId", e.value)
                        }
                        options={hotelDocuments}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select a document type"
                        className={`w-full ${
                          getError(`documents`) ? "p-invalid" : ""
                        }`}
                        disabled={submitting}
                      />
                    </div>
                    {id && doc.existingDocumentUrl && (
                      <div>
                        <label
                          htmlFor={`keepDocument-${index}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Keep Existing Document
                        </label>
                        <InputSwitch
                          id={`keepDocument-${index}`}
                          checked={doc.keepDocument}
                          onChange={(e) =>
                            updateDocument(index, "keepDocument", e.value)
                          }
                          disabled={submitting || !doc.existingDocumentUrl}
                        />
                      </div>
                    )}
                    {(!id || !doc.keepDocument) && (
                      <div>
                        <label
                          htmlFor={`documentUpload-${index}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Document Upload{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-4 flex-wrap">
                          <FileUpload
                            mode="basic"
                            name={`documentUpload-${index}`}
                            maxFileSize={1000000}
                            accept="application/pdf"
                            onSelect={(e) =>
                              updateDocument(index, "documentUrl", e.files[0])
                            }
                            disabled={submitting}
                            className="w-auto"
                            chooseLabel={
                              doc.documentUrl ? "Replace File" : "Choose File"
                            }
                          />
                          {doc.documentUrl && (
                            <div className="flex items-center gap-2 text-sm text-blue-500">
                              <i
                                className="pi pi-file-pdf"
                                style={{ fontSize: "1rem" }}
                              ></i>
                              <span
                                className="truncate max-w-[200px]"
                                title={doc.documentUrl.name}
                              >
                                {doc.documentUrl.name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateDocument(index, "documentUrl", null)
                                }
                                className="text-red-500 hover:text-red-700"
                                disabled={submitting}
                                title="Remove File"
                              >
                                <i
                                  className="pi pi-trash"
                                  style={{ fontSize: "1rem" }}
                                ></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {id && doc.keepDocument && doc.existingDocumentUrl && (
                      <div className="flex items-center gap-2 text-sm text-blue-500">
                        <i
                          className="pi pi-file-pdf"
                          style={{ fontSize: "1rem" }}
                        ></i>
                        <a
                          href={`${
                            import.meta.env
                              .VITE_REACT_APP_BACK_END_UPLOAD_DOCUMENT
                          }/${doc.existingDocumentUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline truncate max-w-[200px]"
                          title={doc.existingDocumentUrl}
                        >
                          View Current File
                        </a>
                      </div>
                    )}
                  </div>
                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="mt-2 text-sm text-red-500"
                      disabled={submitting}
                    >
                      Remove Document
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDocument}
                className="mt-2 text-sm text-blue-500"
                disabled={submitting}
              >
                Add Another Document
              </button>
            </div>

            <div className="col-span-12">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                Policy
              </h4>
              <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="policyName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Policy Name <span className="text-red-500">*</span>
                    </label>
                    <InputText
                      id="policyName"
                      value={policyName}
                      onChange={(e) => setPolicyName(e.target.value)}
                      disabled={submitting}
                      className={`w-full p-2 border rounded-lg ${
                        getError("policy") ? "p-invalid" : ""
                      }`}
                    />
                    {getError("policy") && (
                      <small className="text-red-500 text-xs mt-1">
                        {getError("policy")}
                      </small>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="policyDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Policy Description <span className="text-red-500">*</span>
                    </label>
                    <InputText
                      id="policyDescription"
                      value={policyDescription}
                      onChange={(e) => setPolicyDescription(e.target.value)}
                      disabled={submitting}
                      className={`w-full p-2 border rounded-lg ${
                        getError("policy") ? "p-invalid" : ""
                      }`}
                    />
                    {getError("policy") && (
                      <small className="text-red-500 text-xs mt-1">
                        {getError("policy")}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
                  options={provinces || []}
                  optionLabel="name"
                  placeholder="Select a Province"
                  className={`w-full ${
                    getError("provinceCode") ? "p-invalid" : ""
                  }`}
                  disabled={submitting}
                />
                {getError("provinceCode") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("provinceCode")}
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
                    getError("districtCode") ? "p-invalid" : ""
                  }`}
                  disabled={submitting || !districtData.length}
                />
                {getError("districtCode") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("districtCode")}
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
                  className={`w-full ${
                    getError("wardCode") ? "p-invalid" : ""
                  }`}
                  disabled={submitting || !wardData.length}
                />
                {getError("wardCode") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("wardCode")}
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
                  className={`w-full ${
                    getError("streetId") ? "p-invalid" : ""
                  }`}
                  disabled={submitting || !streetData.length}
                />
                {getError("streetId") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("streetId")}
                  </small>
                )}
              </div>
              <div className="col-span-6 md:col-span-6">
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
              <div className="col-span-6 md:col-span-6">
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Note
                </label>
                <InputText
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={submitting}
                  className={`w-full p-2 border rounded-lg ${
                    getError("note") ? "p-invalid" : ""
                  }`}
                />
                {getError("note") && (
                  <small className="text-red-500 text-xs mt-1">
                    {getError("note")}
                  </small>
                )}
              </div>
            </div>

            <div className="col-span-12 flex items-center gap-4 mt-4">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <InputSwitch
                id="status"
                checked={status}
                onChange={(e) => setStatus(e.value)}
                disabled={submitting}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
