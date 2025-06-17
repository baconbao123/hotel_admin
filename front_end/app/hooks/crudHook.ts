import { useState, useEffect, useCallback, useRef } from "react";
import $axios from "@/axios";
import { ApiResponse } from "@/types/apiResponse.type";

interface ErrorResponse {
  code: number;
  message: string;
}

export default function useCrud(baseUrl: string) {
  const [data, setData] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(true); 
  const [actionLoading, setActionLoading] = useState(false); 
  const [error, setError] = useState<Object | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openFormDetail, setOpenFormDetail] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortField, setSortField] = useState<string>();
  const [sortOrder, setSortOrder] = useState<number>();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const parseQueryParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      if (key !== "page" && key !== "size" && !key.startsWith("sort[")) {
        result[key] = value;
      }
    });
    return result;
  }, []);

  useEffect(() => {
    const initialFilters = parseQueryParams();
    setFilters(initialFilters);
    loadData(initialFilters);
  }, [baseUrl, parseQueryParams]);

  const loadData = async (
    currentFilters: Record<string, string>,
    sortFieldParam = sortField,
    sortOrderParam = sortOrder,
    showLoading = true
  ) => {
    if (showLoading) setTableLoading(true);
    try {
      const query = new URLSearchParams();
      Object.entries(currentFilters).forEach(
        ([key, value]) => value && query.append(key, value)
      );
      if (sortFieldParam && sortOrderParam)
        query.append(
          `sort[${sortFieldParam}]`,
          sortOrderParam === 1 ? "desc" : "asc"
        );
      query.append("page", page.toString());
      query.append("size", pageSize.toString());

      const res = await $axios.get(`${baseUrl}?${query}`);
      const apiResponse = new ApiResponse(res.data);
      setData(apiResponse.result.content || []);
      setTotalRecords(apiResponse.result.totalElements || 0);
      setError(null);

      const urlParams = new URLSearchParams();
      Object.entries(currentFilters).forEach(
        ([key, value]) => value && urlParams.append(key, value)
      );
      window.history.replaceState(
        null,
        "",
        urlParams.toString()
          ? `${window.location.pathname}?${urlParams}`
          : window.location.pathname
      );
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      setError(errorResponse?.message || "Failed to load data");
      throw new Error(errorResponse?.message || "Failed to load data");
    } finally {
      if (showLoading) setTableLoading(false);
    }
  };

  const updatePageData = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
    loadData(filters, sortField, sortOrder, false);
  };

  const handleSort = (field: string, order: number) => {
    setSortField(field);
    setSortOrder(order);
    loadData(filters, field, order);
  };

  const handleSearch = useCallback(
    (field: string, value: string) => {
      const newFilters = { ...filters, [field]: value };
      if (!value) delete newFilters[field];
      setFilters(newFilters);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => loadData(newFilters, sortField, sortOrder, false),
        1000
      );
    },
    [filters, sortField, sortOrder]
  );

  const resetFilters = () => {
    setFilters({});
    loadData({});
  };

  const loadById = useCallback(
    async (id: string) => {
      setActionLoading(true);
      try {
        const res = await $axios.get(`${baseUrl}/${id}`);
        return res.data.result;
      } catch (err: any) {
        const errorResponse = err.response?.data as ErrorResponse;
        setError(errorResponse?.message || "Failed to load data");
        throw new Error(errorResponse?.message || "Failed to load data");
      } finally {
        setActionLoading(false);
      }
    },
    [baseUrl]
  );

  const createItem = async (item: object | FormData) => {
    setActionLoading(true);
    try {
      const config =
        item instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : { headers: { "Content-Type": "application/json" } };;
      const res = await $axios.post(baseUrl, item, config);
      await loadData(filters, sortField, sortOrder, true); // Tải lại table
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.errorMessages || "Failed to create item");
      throw new Error(err.response?.data?.message || "Failed to create item");
    } finally {
      setActionLoading(false);
    }
  };

  const updateItem = async (id: string, item: object | FormData) => {
    setActionLoading(true);
    try {
      const config =
        item instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : { headers: { "Content-Type": "application/json" } };
      const res = await $axios.put(`${baseUrl}/${id}`, item, config);
      await loadData(filters, sortField, sortOrder, true); // Tải lại table
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update item");
      throw new Error(err.response?.data?.message || "Failed to update item");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await $axios.delete(`${baseUrl}/${id}`);
      await loadData(filters, sortField, sortOrder, true); 
      setError(null);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete item");
      throw new Error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    data,
    tableLoading,
    actionLoading,
    error,
    openForm,
    setOpenForm,
    openFormDetail,
    setOpenFormDetail,
    loadById,
    loadData,
    updatePageData,
    handleSort,
    handleSearch,
    resetFilters,
    createItem,
    updateItem,
    deleteItem,
    page,
    pageSize,
    totalRecords,
    filters,
    sortField,
    sortOrder,
  };
}
