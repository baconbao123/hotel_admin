import { useState, useEffect, useCallback } from "react";
import $axios from "@/axios";
import { ApiResponse } from "@/types/apiresponse.type";

export default function useCrud(baseUrl: string) {
  const [data, setData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setopenForm] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sort, setSort] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<number | undefined>(undefined);
  const [searchFilters, setSearchFilters] = useState<Record<string, string>>(
    {}
  );

  // READ 
  const loadDataTable = async (
    filters: Record<string, string> = searchFilters,
    sortField: string | null = sort,
    setLoadingState: boolean = true
  ) => {
    if (setLoadingState) setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      if (sortField) {
        queryParams.append("sort", sortField);
      }

      const url = `${baseUrl}/get-all?${queryParams.toString()}`;
      console.log("API Request URL:", url);
      const res = await $axios.get(url);
      const apiResponse = new ApiResponse(res.data);
      const newData = apiResponse.result.content || [];
      console.log("API Response Data:", newData);
      setAllData(newData);
      setTotalRecords(apiResponse.result.totalElements || newData.length);
      const start = page * pageSize;
      const end = start + pageSize;
      setData(newData.slice(start, end));
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Failed to load data:", err);
      throw err;
    } finally {
      if (setLoadingState) setLoading(false); 
    }
  };

  // Update page or page size
  const updatePageData = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
    const start = newPage * newPageSize;
    const end = start + newPageSize;
    setData(allData.slice(start, end));
  };

  // Handle sorting
  const handleSort = (newSortField: string, newSortOrder: number) => {
    const sortString =
      newSortOrder === 0
        ? null
        : `${newSortField},${newSortOrder === 1 ? "desc" : "asc"}`;
    setSort(sortString);
    setSortField(newSortField);
    setSortOrder(newSortOrder);
    loadDataTable(searchFilters, sortString);
  };

  const handleSearchChange = (field: string, value: string) => {
    const newFilters = { ...searchFilters, [field]: value };
    if (!value) {
      delete newFilters[field]; // Xóa key nếu value là chuỗi rỗng
    }
    console.log("New Filters:", newFilters);
    setSearchFilters(newFilters);
    loadDataTable(newFilters, sort, false);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchFilters({});
    loadDataTable({}, sort);
  };

  // READ by ID
  const loadDataById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await $axios.get(`${baseUrl}/find-by-id/${id}`);
        return res.data.result;
      } catch (err) {
        setError(err);
        throw err;
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
    } catch (err) {
      console.error("Error creating item:", err);
      setError(err);
      throw err;
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
    } catch (err) {
      console.error("Error updating item:", err);
      setError(err);
      throw err;
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
    } catch (err) {
      setError(err);
      throw err;
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
