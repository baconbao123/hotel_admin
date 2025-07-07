import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import BreadCrumbComponent from "~/components/common/breadCrumb/BreadCrumbComponent";
import Swal from "sweetalert2";
import PermissionForm from "~/pages/permission/PermissionForm";
import "@/pages/permission/Permission.scss";
import useCrud from "~/hook/crudHook";
import PermissionDetail from "~/pages/permission/PermissionDetail";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { SkeletonTemplate } from "~/components/common/skeleton";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { toast } from "react-toastify";
import type { Route } from "./+types/PermissionList";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Permisison" },
    { name: "description", content: "Hotel Admin Permisison" },
  ];
}

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
  const [selectedId, setSelectedId] = useState<string>();

  const [permissionData, setPermissionData] = useState<any>(null);
  const [processedData, setProcessedData] = useState<RoleData[]>([]);

  const [mounted, setMounted] = useState(false);


  const {
    data,
    tableLoading,
    openForm,
    setOpenForm,
    loadById,
    setOpenFormDetail,
    updatePageData,
    handleSort,
    handleSearch,
    refresh,
    deleteItem,
    page,
    pageSize,
    totalRecords,
    filters,
    sortField,
    sortOrder,
    openFormDetail,
    permissionPage
  } = useCrud("/permission", undefined, undefined, 'Permissions');


  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const roleMap = new Map<number, RoleData>();
    data.forEach((perm: PermissionRes) => {
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
      (a, b) => b.roleId - a.roleId
    );
    setProcessedData(sortedData);
  }, [data]);

  const handlePageChange = (e: any) => updatePageData(e.page, e.rows);

  const handleSortChange = (e: any) =>
    handleSort(e.sortField || "", e.sortOrder || 0);

  async function handleDelete(id: string): Promise<boolean> {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Yes",
      });

      if (result.isConfirmed) {
        await deleteItem(id);
        return true;
      }
      return false; // User canceled or denied
    } catch (error) {
      console.error("Error during delete operation:", error);
      return false; // Delete failed due to error
    }
  }


  return (
    <div className="main-container">
      <div className="mb-5">
        {mounted ? (
          <BreadCrumbComponent name="PermissionList" />
        ) : (
          <Skeleton width="100%" height="34px" />
        )}
      </div>

      <Card title="Permission management">
        <div className="mb-5">
          <div className="grid grid-cols-4 gap-10 card">
            <div className="col-span-4 2xl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3">
              <div className="grid gap-2 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
                {mounted ? (
                  <>
                    <InputText
                      placeholder="Name"
                      className="w-full"
                      value={filters.roleName || ""}
                      onChange={(e) => handleSearch("roleName", e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <Skeleton height="100%" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {tableLoading ? (
          SkeletonTemplate("Permission Management", 5)
        ) : (
          <DataTable
            value={processedData}
            paginator
            rows={pageSize}
            rowsPerPageOptions={[1, 5, 10, 25, 30]}
            totalRecords={totalRecords}
            first={page * pageSize}
            onPage={handlePageChange}
            onSort={handleSortChange}
            sortField={sortField}
            sortOrder={sortOrder as 1 | -1 | 0 | undefined}
            showGridlines
            rowHover
            lazy
            loading={tableLoading}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="From {first} to {last} of {totalRecords}"
            paginatorLeft={
              <Button
                severity="secondary"
                icon="pi pi-refresh"
                text
                onClick={refresh}
              />
            }
          >
            <Column
              sortable
              field="roleId"
              header="Id"
              className="w-20"
            ></Column>
            <Column
              sortable
              field="roleName"
              header="Name"
              className="w-50"
            ></Column>
            <Column
              field="permissions"
              header="Resources"
              body={(rowData) => {
                const [expandedResource, setExpandedResource] =
                  useState<any>(null);
                const uniqueResources = [
                  ...new Set(
                    rowData.permissions?.map(
                      (res: Resource) => res.resourceName
                    )
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
                      <span className="no-resources">-</span>
                    )}
                  </div>
                );
              }}
            />
            <Column
              frozen={true}
              header="Actions"
              className="w-60"
              body={(rowData) => (
                <div className="flex gap-2 justify-center">
                  {permissionPage.view && (
                    <Button
                      icon="pi pi-eye"
                      rounded
                      text
                      className="icon_view"
                      onClick={async () => {
                        try {
                          const response = await loadById(
                            String(rowData.roleId)
                          );
                          setSelectedId(String(rowData.roleId));

                          setPermissionData(response);
                          setOpenFormDetail(true);
                        } catch (error) {
                          toast.error("Failed to load permission details", {
                            autoClose: 3000,
                          });
                        }
                        }}
                      tooltip="View"
                      tooltipOptions={{ position: "top" }}
                    />
                  )}

                  {permissionPage.update && (
                    <Button
                      icon="pi pi-pencil"
                      className="icon_edit"
                      rounded
                      text
                      severity="success"
                      onClick={async () => {
                        try {
                          const response = await loadById(
                            String(rowData.roleId)
                          );
                          setSelectedId(String(rowData.roleId));
                          setPermissionData(response);
                          setOpenForm(true);
                        } catch (error) {
                          console.error("Failed to load permission details", error);
                          toast.error("Failed to load permission details", {
                            autoClose: 3000,
                          });
                        }
                      }}
                      tooltip="Edit"
                      tooltipOptions={{ position: "top" }}
                    />
                  )}

                  {permissionPage.delete && (
                    <Button
                      icon="pi pi-trash"
                      className="icon_trash"
                      rounded
                      text
                      severity="danger"
                      onClick={() => handleDelete(rowData.roleId.toString())}
                      tooltip="Delete"
                      tooltipOptions={{ position: "top" }}
                    />
                  )}
                </div>
              )}
            ></Column>
          </DataTable>
        )}
      </Card>

      {(permissionPage.create || permissionPage.update) && (
        <PermissionForm
          id={selectedId}
          open={openForm}
          permissionData={permissionData}
          onClose={() => {
            setOpenForm(false);
            setSelectedId(undefined);
            setPermissionData(null);
          }}
          loadDataTable={async () => {
            await updatePageData(page, pageSize);
          }}
        />
      )}

      {permissionPage.view && (
        <PermissionDetail
          id={selectedId}
          open={openFormDetail}
          permissionData={permissionData}
          onClose={() => {
            setOpenFormDetail(false);
            setSelectedId(undefined);
            setPermissionData(null);
          }}
        />
      )}
    </div>
  );
}
