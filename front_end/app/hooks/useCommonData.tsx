import { type AppDispatch, type RootState } from "@/store";
import {
  fetchCommonData,
  type CommonData,
  type CommonDataResponse,
} from "@/store/slices/commonDataSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const typeMapping: Partial<Record<keyof CommonData, keyof CommonDataResponse>> =
  {
    facilitiestype: "facilityTypes",
    hoteldocuments: "documentTypes",
    hoteltypes: "hotelTypes",
    roles: "roles",
    provinces: "provinces",
    permissions: "resourceActions",
    hotelfacilities: "hotelFacilities",
    paymentmethods: "paymentMethods",
    roomtypes: "roomTypes",
    owners: "owners",
    usertypes: "userTypes",
    customers: "customers"
  };

export const useCommonData = (
  types: (keyof CommonData)[],
  options: { force?: boolean } = {}
) => {
  const dispatch = useDispatch<AppDispatch>();
  const commonData = useSelector((state: RootState) => state.commonData.data);
  const status = useSelector((state: RootState) => state.commonData.status);
  const error = useSelector((state: RootState) => state.commonData.error);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current && !options.force) return;
    hasFetchedRef.current = true;
    console.log("Dispatching fetchCommonData", { types, force: options.force });
    dispatch(fetchCommonData({ types, force: options.force }));
  }, [dispatch, types, options.force]); // types must be memoized in parent

  const mappedData = types.reduce((acc, type) => {
    const responseKey = typeMapping[type];
    if (responseKey) {
      acc[responseKey] = commonData[type] || [];
    }
    return acc;
  }, {} as CommonDataResponse);

  return { commonData: mappedData, status, error };
};
