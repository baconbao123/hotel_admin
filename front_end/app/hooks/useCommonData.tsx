import type { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export const useRoles = () => {
  const dispatch = useDispatch<AppDispatch>();
  const roles = useSelector(
    (state: RootState) => state.commonData.data.roles || []
  );
  const loading = useSelector(
    (state: RootState) => state.commonData.loading.roles || false
  );
  const error = useSelector(
    (state: RootState) => state.commonData.error.roles || null
  );

  return { roles, loading, error };
};

// Custom hooks cho các loại dữ liệu khác
export const useProvinces = () => {
  const dispatch = useDispatch<AppDispatch>();
  const provinces = useSelector(
    (state: RootState) => state.commonData.data.provinces || []
  );
  const loading = useSelector(
    (state: RootState) => state.commonData.loading.provinces || false
  );
  const error = useSelector(
    (state: RootState) => state.commonData.error.provinces || null
  );

  return { provinces, loading, error };
};

///
export const useFacilityTypes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const facilityTypes = useSelector(
    (state: RootState) => state.commonData.data.facilityTypes || []
  );
  const loading = useSelector(
    (state: RootState) => state.commonData.loading.facilityTypes || false
  );
  const error = useSelector(
    (state: RootState) => state.commonData.error.facilityTypes || null
  );

  return { facilityTypes, loading, error };
};

// Tương tự cho resourceActions, hotelDocuments, hotelTypes, hotelFacilities
export const useResourceActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const resourceActions = useSelector(
    (state: RootState) => state.commonData.data.resourceActions || []
  );
  const loading = useSelector(
    (state: RootState) => state.commonData.loading.resourceActions || false
  );
  const error = useSelector(
    (state: RootState) => state.commonData.error.resourceActions || null
  );

  return { resourceActions, loading, error };
};

export const useHotelDocuments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hotelDocuments = useSelector(
    (state: RootState) => state.commonData.data.documentTypes || []
  );
  const loading = useSelector(
    (state: RootState) => state.commonData.loading.documentTypes || false
  );
  const error = useSelector(
    (state: RootState) => state.commonData.error.documentTypes || null
  );

  return { hotelDocuments, loading, error };
};

export const useHotelTypes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hotelTypes = useSelector(
    (state: RootState) => state.commonData.data.hotelTypes || []
  );
  const loading = useSelector(
    (state: RootState) => state.commonData.loading.hotelTypes || false
  );
  const error = useSelector(
    (state: RootState) => state.commonData.error.hotelTypes || null
  );

  return { hotelTypes, loading, error };
};

export const useHotelFacilities = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hotelFacilities = useSelector(
    (state: RootState) => state.commonData.data.hotelFacilities || []
  );
  const loading = useSelector(
    (state: RootState) => state.commonData.loading.hotelFacilities || false
  );
  const error = useSelector(
    (state: RootState) => state.commonData.error.hotelFacilities || null
  );

  return { hotelFacilities, loading, error };
};
