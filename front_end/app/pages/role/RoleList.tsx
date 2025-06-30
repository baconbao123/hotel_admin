import { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton";
import Swal from "sweetalert2";
import BreadCrumbComponent from "@/components/common/breadCrumb/BreadCrumbComponent";
import useCrud from "@/hooks/crudHook";
import RoleForm from "@/pages/role/RoleForm";
import RoleDetail from "@/pages/role/RoleDetail";
import { SkeletonTemplate } from "@/components/common/skeleton";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store";
import { fetchCommonData } from "@/store/slices/commonDataSlice";

export default function RoleList() {
  const [selectedId, setSelectedId] = useState<string>();
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [mounted, setMounted] = useState(false);
  const toast = useRef<Toast>(null);

  const permissions = useSelector(
    (state: any) => state.permissions.permissions
  );

  const {
    data,
    tableLoading,
    error,
    openForm,
    setOpenForm,
    openFormDetail,
    setOpenFormDetail,
    loadById,
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
    closeForm,
  } = useCrud("/role");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePageChange = (e: any) => updatePageData(e.page, e.rows);
  const handleSortChange = (e: any) =>
    handleSort(e.sortField || "", e.sortOrder || 0);

  const dispatch = useAppDispatch();

  async function handleDelete(id: string): Promise<boolean> {
    try {
      const result = await Swal.fire({
        title: "Delete role?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Delete",
      });

      if (result.isConfirmed) {
        await deleteItem(id);
        await Swal.fire("Deleted!", "", "success");
        return true; // Delete successful
      }
      return false; // User canceled or denied
    } catch (error) {
      console.error("Error during delete operation:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete role",
        life: 3000,
      });
      return false; // Delete failed due to error
    }
  }

  // Check actions
  const hasPermission = (actionName: string) => {
    const resource = permissions.find((p: any) => p.resourceName === "Role");
    return resource ? resource.actionNames.includes(actionName) : false;
  };

  const statusBody = (row: any) => (
    <div className="flex justify-center">
      <Tag
        rounded
        value={row.status ? "Active" : "Inactive"}
        severity={row.status ? "success" : "danger"}
        style={{
          maxWidth: "5rem",
          display: "flex",
          justifyContent: "center",
          padding: "0.4rem 3rem",
        }}
      />
    </div>
  );

  return (
    <div className="main-container">
      {mounted && <Toast ref={toast} />}
      <div className="mb-5">
        {mounted ? (
          <BreadCrumbComponent name="RoleList" />
        ) : (
          <Skeleton width="100%" height="34px" />
        )}
      </div>

      <Card title="Role management">
        <div className="mb-5">
          <div className="grid grid-cols-4 gap-10 card">
            <div className="col-span-4 2xl:col-span-3">
              <div className="grid gap-2 2xl:grid-cols-6 grid-cols-2">
                {mounted ? (
                  <>
                    <InputText
                      placeholder="Name"
                      className="w-full"
                      value={filters.name || ""}
                      onChange={(e) => handleSearch("name", e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <Skeleton height="100%" />
                  </>
                )}
              </div>
            </div>
            <div className="col-span-4 2xl:col-span-1">
              <div className="flex flex-wrap gap-2 justify-end">
                {hasPermission("create") && (
                  <Button
                    label="Add New"
                    className="btn_add_new"
                    onClick={() => {
                      setSelectedId(undefined);
                      setFormMode("create");
                      setOpenForm(true);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {tableLoading ? (
          SkeletonTemplate("Role Management", 5)
        ) : (
          <DataTable
            value={data}
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
            scrollable
            scrollHeight="570px"
            lazy
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="From {first} to {last} of {totalRecords}"
            paginatorLeft={
              <Button
                severity="secondary"
                icon="pi pi-refresh"
                text
                onClick={resetFilters}
              />
            }
          >
            <Column sortable field="id" header="Id" className="w-20" />
            <Column sortable field="name" header="Name" className="w-200" />
            <Column
              field="description"
              header="Description"
              className="w-200"
              body={(row) => row.description || "-"}
            />
            <Column
              sortable
              field="status"
              header="Status"
              className="text-center w-50"
              body={statusBody}
            />
            <Column
              frozen={true}
              header={() => <div className="flex justify-center">Actions</div>}
              className="w-60"
              body={(row) => (
                <div className="flex gap-2 justify-center">
                  {hasPermission("view") && (
                    <Button
                      icon="pi pi-eye"
                      rounded
                      text
                      className="icon_view"
                      onClick={() => {
                        setSelectedId(String(row.id));
                        setFormMode("view");
                        setOpenFormDetail(true);
                      }}
                      tooltip="View"
                      tooltipOptions={{ position: "top" }}
                    />
                  )}
                  
                  {hasPermission("update") && (
                    <Button
                      icon="pi pi-pencil"
                      rounded
                      text
                      className="icon_edit"
                      onClick={() => {
                        setSelectedId(String(row.id));
                        setFormMode("edit");
                        setOpenForm(true);
                      }}
                      tooltip="Edit"
                      tooltipOptions={{ position: "top" }}
                    />
                  )}

                  {hasPermission("delete") && (
                    <Button
                      icon="pi pi-trash"
                      rounded
                      text
                      className="icon_trash"
                      style={{ color: "blue" }}
                      onClick={async () => {
                        try {
                          const deleted = await handleDelete(String(row.id));
                          if (deleted) {
                            const result = await dispatch(
                              fetchCommonData({
                                types: ["roles"],
                                forceRefresh: true,
                              })
                            );
                            if (fetchCommonData.rejected.match(result)) {
                              toast.current?.show({
                                severity: "error",
                                summary: "Error",
                                detail: "Failed to refresh roles data",
                                life: 3000,
                              });
                            }
                            await updatePageData(page, pageSize);
                          }
                        } catch (error) {
                          console.error(
                            "Error during delete operation:",
                            error
                          );
                        }
                      }}
                      tooltip="Delete"
                      tooltipOptions={{ position: "top" }}
                    />
                  )}
                </div>
              )}
            />
          </DataTable>
        )}
      </Card>

      {(hasPermission("create") || hasPermission("update")) && (
        <RoleForm
          id={selectedId}
          open={openForm}
          mode={formMode}
          onClose={() => {
            closeForm();
            setFormMode("create");
          }}
          loadDataById={loadById}
          createItem={createItem}
          updateItem={updateItem}
          error={error}
        />
      )}

      {hasPermission("view") && (
        <RoleDetail
          id={selectedId}
          open={openFormDetail}
          mode={formMode}
          onClose={() => {
            setOpenFormDetail(false);
            setSelectedId(undefined);
            setFormMode("view");
          }}
          loadDataById={loadById}
        />
      )}
    </div>
  );
}
