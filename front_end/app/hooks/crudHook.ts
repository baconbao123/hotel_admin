import { useState, useEffect, useCallback } from "react";
import $axios from "@/axios";
import { ApiResponse } from "@/types/apiResponse.type";


interface ErrorResponse {
  code: number;
  message: string;
}

export default function useCrud(baseUrl: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setopenForm] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<number | undefined>(undefined);
  const [searchFilters, setSearchFilters] = useState<Record<string, string>>(
    {}
  );

  // READ
  const loadDataTable = async (
    filters: Record<string, string> = searchFilters,
    sortFieldParam: string | null | undefined = sortField,
    sortOrderParam: number | null | undefined = sortOrder,
    setLoadingState: boolean = true
  ) => {
    if (setLoadingState) setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      if (sortFieldParam && sortOrderParam !== 0) {
        const direction = sortOrderParam === 1 ? "desc" : "asc";
        queryParams.append(`sort[${sortFieldParam}]`, direction);
      }

      queryParams.append("page", page.toString());
      queryParams.append("size", pageSize.toString());

      const url = `${baseUrl}/get-all?${queryParams.toString()}`;
      const res = await $axios.get(url);
      const apiResponse = new ApiResponse(res.data);
      const newData = apiResponse.result.content || [];
      setData(newData);
      setTotalRecords(apiResponse.result.totalElements || newData.length);
      setError(null);
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      setError(errorResponse?.message || "Failed to load data");
      console.error("Failed to load data:", errorResponse?.message || err);
      throw new Error(errorResponse?.message || "Failed to load data");
    } finally {
      if (setLoadingState) setLoading(false);
    }
  };

  const updatePageData = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
    loadDataTable(searchFilters, sortField, sortOrder, false);
  };

  // Handle sorting
  const handleSort = (newSortField: string, newSortOrder: number) => {
    setSortField(newSortField);
    setSortOrder(newSortOrder);
    loadDataTable(searchFilters, newSortField, newSortOrder);
  };

  const handleSearchChange = (field: string, value: string) => {
    const newFilters = { ...searchFilters, [field]: value };
    if (!value) {
      delete newFilters[field];
    }
    setSearchFilters(newFilters);
    loadDataTable(newFilters, sortField, sortOrder, false);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchFilters({});
    loadDataTable({}, sortField, sortOrder);
  };

  // READ by ID
  const loadDataById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await $axios.get(`${baseUrl}/find-by-id/${id}`);
        return res.data.result;
      } catch (err: any) {
        const errorResponse = err.response?.data as ErrorResponse;
        setError(errorResponse?.message || "Failed to load data");
        throw new Error(errorResponse?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    },
    [baseUrl]
  );

  // CREATE
  const createItem = async (newItem: object | FormData) => {
    setLoading(true);
    try {
      const config =
        newItem instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : { headers: { "Content-Type": "application/json" } };
      const res = await $axios.post(baseUrl + "/create", newItem, config);
      if (res.data) {
        await loadDataTable();
        return res.data;
      }
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      setError(errorResponse?.message || "Failed to create item");
      throw new Error(errorResponse?.message || "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const updateItem = async (id: string, updatedItem: object | FormData) => {
    setLoading(true);
    try {
      const config =
        updatedItem instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : { headers: { "Content-Type": "application/json" } };
      const res = await $axios.put(
        `${baseUrl}/update/${id}`,
        updatedItem,
        config
      );
      if (res.data) {
        await loadDataTable();
        setError(null);
        return res.data;
      }
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      setError(errorResponse?.message || "Failed to update item");
      throw new Error(errorResponse?.message || "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteItem = async (id: string) => {
    setLoading(true);
    try {
      const res = await $axios.delete(`${baseUrl}/delete/${id}`);
      await loadDataTable();
      return res.data;
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      setError(errorResponse?.message || "Failed to delete item");
      throw new Error(errorResponse?.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataTable();
  }, [baseUrl]);

  return {
    data,
    loading,
    error,
    openForm,
    setopenForm,
    loadDataById,
    loadDataTable,
    updatePageData,
    handleSort,
    handleSearchChange,
    resetFilters,
    createItem,
    updateItem,
    deleteItem,
    page,
    pageSize,
    totalRecords,
    searchFilters,
    setSearchFilters,
    sortField,
    sortOrder,
  };
}
