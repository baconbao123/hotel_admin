import { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton";
import Swal from "sweetalert2";
import BreadCrumbComponent from "~/components/common/breadCrumb/BreadCrumbComponent";
import useCrud from "~/hook/crudHook";
import RoleForm from "~/pages/role/RoleForm";
import RoleDetail from "~/pages/role/RoleDetail";
import { SkeletonTemplate } from "~/components/common/skeleton";
import { useSelector } from "react-redux";
import { type RootState } from "~/store";
import { useDispatch } from "react-redux"; 
import { fetchCommonData } from "~/store/slice/commonDataSlice";
import type { AppDispatch } from "~/store";
import type { Route } from "./+types/RoleList";
import { toast } from "react-toastify";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Role" },
    { name: "description", content: "Hotel Admin Role" },
  ];
}

export default function RoleList() {
  const [selectedId, setSelectedId] = useState<string>();
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [mounted, setMounted] = useState(false);
  const loadPermisison = useSelector((state: RootState) =>  state.permissionSlice.loadPermisison)


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
    refresh,
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
    permissionPage
  } = useCrud("/role", undefined, undefined, 'Role');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePageChange = (e: any) => updatePageData(e.page, e.rows);
  const handleSortChange = (e: any) =>
    handleSort(e.sortField || "", e.sortOrder || 0);
  const dispatch: AppDispatch = useDispatch();

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
      toast.error('Delete failed', {
        autoClose: 3000
      });
      return false; // Delete failed due to error
    }
  }

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
                {permissionPage.create && (
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
            key={JSON.stringify(permissionPage)}
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
                onClick={refresh}
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
                  {permissionPage.view && (
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

                  {permissionPage.update && (
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

                  {permissionPage.delete && (
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
                                force: true,
                              })
                            );
                            if (fetchCommonData.rejected.match(result)) {
                              toast.success('Failed to refresh roles data', {
                              autoClose: 3000,
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

      {(permissionPage.create || permissionPage.update)  && (
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

      {permissionPage.view  && loadPermisison && (
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
