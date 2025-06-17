import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import BreadCrumbComponent from "@/components/common/breadCrumb/BreadCrumbComponent";
import Swal from "sweetalert2";
import $axios from "@/axios";
import PermissionForm from "@/pages/permission/PermissionForm";
import "@/pages/permission/Permission.scss";

interface Resource {
  id: number; // mapRsActionId
  resourceId: number;
  resourceName: string;
  actionId: number;
  actionName: string;
}

interface RoleData {
  roleId: number;
  roleName: string;
  permissions: Resource[];
}

interface PermissionRes {
  permissionId: number;
  roleRes: RoleData[];
}

export default function PermissionList() {
  const [data, setData] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [formMode, setFormMode] = useState<"edit" | "view">("edit");
  const [permissionData, setPermissionData] = useState<any>(null);
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortField, setSortField] = useState<string>("roleId");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [searchFilters, setSearchFilters] = useState<Record<string, string>>(
    {}
  );

  const toast = useRef<Toast>(null);

  const loadDataTable = async (
    filters: Record<string, string> = searchFilters,
    sortFieldParam: string | undefined = sortField,
    sortOrderParam: number | undefined = sortOrder,
    newPage: number = page,
    newPageSize: number = pageSize
  ) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      // if (sortFieldParam && sortOrderParam !== 0) {
      //   const direction = sortOrderParam === 1 ? "asc" : "desc";
      //   queryParams.append(`sort[${sortFieldParam}]`, direction);
      // }

      queryParams.append("page", newPage.toString());
      queryParams.append("size", newPageSize.toString());

      const res = await $axios.get(`/permission?${queryParams.toString()}`);
      const permissions = res.data.result.content || [];
      const roleMap = new Map<number, RoleData>();

      permissions.forEach((perm: PermissionRes) => {
        perm.roleRes.forEach((role: RoleData) => {
          if (!roleMap.has(role.roleId)) {
            roleMap.set(role.roleId, {
              roleId: role.roleId,
              roleName: role.roleName,
              permissions: role.permissions || [],
            });
          } else {
            const existingRole = roleMap.get(role.roleId)!;
            existingRole.permissions = [
              ...existingRole.permissions,
              ...(role.permissions || []),
            ];
          }
        });
      });

      const sortedData = Array.from(roleMap.values()).sort(
        (a, b) => a.roleId - b.roleId
      );
      setData(sortedData);
      setTotalRecords(res.data.result.totalElements || permissions.length);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch permissions",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: any) => {
    const newPage = event.page;
    const newPageSize = event.rows;
    setPage(newPage);
    setPageSize(newPageSize);
    loadDataTable(searchFilters, sortField, sortOrder, newPage, newPageSize);
  };

  const handleSortChange = (e: any) => {
    const newSortField = e.sortField || "roleId";
    const newSortOrder = e.sortField ? e.sortOrder : 1;
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
    loadDataTable(newFilters, sortField, sortOrder);
  };

  const resetFilters = () => {
    setSearchFilters({});
    loadDataTable({}, sortField, sortOrder);
  };

  const handleDelete = async (roleId: string) => {
    const result = await Swal.fire({
      title: "Do you want to delete role?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await $axios.delete(`/permission/${roleId}`);
        Swal.fire("Deleted!", "", "success");
        setData(data.filter((role) => role.roleId.toString() !== roleId));
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete role",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (roleId: string) => {
    setSelectedUserId(roleId);
    setFormMode("edit");
    setOpenForm(true);
    try {
      const response = await $axios.get(`/permission/${roleId}`);
      const permissionData = response.data.result;
      console.log("Permission data from endpoint with roleId:", permissionData);
      setPermissionData(permissionData);
    } catch (error) {
      console.error("Error fetching permission details:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load permission details",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    loadDataTable();
  }, []);

  const paginatorLeft = (
    <Button
      type="button"
      severity="secondary"
      icon="pi pi-refresh"
      text
      onClick={resetFilters}
    />
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="mb-5">
        <BreadCrumbComponent name="RoleList" />
      </div>

      <Card title="Permission management">
        <div className="mb-5">
          <div className="grid grid-cols-4 gap-10 card">
            <div className="col-span-4 2xl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3">
              <div className="grid gap-2 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
                <InputText
                  placeholder="Search by name"
                  className="w-full"
                  value={searchFilters.name || ""}
                  onChange={(e) => handleSearchChange("name", e.target.value)}
                />
              </div>
            </div>
            <div className="col-span-4 2xl:col-span-1 xl:col-span-1 lg:col-span-1 md:col-span-1">
              <div className="flex flex-wrap gap-2 justify-end">
                <Button className="me-2" label="Export excel" />
              </div>
            </div>
          </div>
        </div>

        <DataTable
          value={data}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          rows={pageSize}
          showGridlines
          rowHover
          lazy
          loading={loading}
          rowsPerPageOptions={[20, 50, 70]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="From {first} to {last} of {totalRecords}"
          paginatorLeft={paginatorLeft}
          totalRecords={totalRecords}
          first={page * pageSize}
          onPage={handlePageChange}
          onSort={handleSortChange}
          sortField={sortField}
          sortOrder={sortOrder as 1 | -1 | 0 | undefined}
        >
          <Column sortable field="roleId" header="Id"></Column>
          <Column sortable field="roleName" header="Name"></Column>
          <Column
            style={{ width: "700px" }}
            field="permissions"
            header="Resources"
            body={(rowData) => {
              const [expandedResource, setExpandedResource] =
                useState<any>(null);
              const uniqueResources = [
                ...new Set(
                  rowData.permissions?.map((res: Resource) => res.resourceName)
                ),
              ];

              return (
                <div
                  className="resource-container"
                  style={{ minWidth: "200px" }}
                >
                  {uniqueResources.length > 0 ? (
                    uniqueResources.map((resourceName: any, index) => (
                      <div
                        key={index}
                        style={{ marginBottom: "8px", position: "relative" }}
                      >
                        <span
                          className={`resource-item ${
                            expandedResource === resourceName ? "active" : ""
                          }`}
                          onClick={() =>
                            setExpandedResource((prev: any) =>
                              prev === resourceName ? null : resourceName
                            )
                          }
                        >
                          {resourceName}
                        </span>
                        {expandedResource === resourceName && (
                          <ul className="action-list">
                            {rowData.permissions
                              .filter(
                                (res: Resource) =>
                                  res.resourceName === resourceName
                              )
                              .map((res: Resource, idx: number) => (
                                <li key={idx}>{res.actionName}</li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="no-resources"></span>
                  )}
                </div>
              );
            }}
          />
          <Column
            header="Actions"
            style={{ width: "15%" }}
            body={(rowData) => (
              <div className="flex gap-2">
                <Button
                  icon="pi pi-eye"
                  rounded
                  text
                  severity="info"
                  onClick={() => {
                    setSelectedUserId(rowData.roleId.toString());
                    setFormMode("view");
                    setOpenForm(true);
                  }}
                  tooltip="View"
                  tooltipOptions={{ position: "top" }}
                />
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="success"
                  onClick={() => handleEdit(rowData.roleId.toString())}
                  tooltip="Edit"
                  tooltipOptions={{ position: "top" }}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  onClick={() => handleDelete(rowData.roleId.toString())}
                  tooltip="Delete"
                  tooltipOptions={{ position: "top" }}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </Card>

      <PermissionForm
        id={selectedUserId}
        open={openForm}
        mode={formMode}
        permissionData={permissionData}
        onClose={() => {
          setOpenForm(false);
          setSelectedUserId(undefined);
          setPermissionData(null);
          setFormMode("edit");
        }}
        loadDataTable={loadDataTable}
      />
    </div>
  );
}
