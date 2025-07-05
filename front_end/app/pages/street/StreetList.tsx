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
import { SkeletonTemplate } from "@/components/common/skeleton";
import StreetForm from "./StreetForm";
import StreetDetail from "./StreetDetail";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Loading from "@/components/shared/Loading";

export default function StreetList() {
  const [selectedId, setSelectedId] = useState<string>();
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [mounted, setMounted] = useState(false);
  const toast = useRef<Toast>(null);

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
  } = useCrud("/local");

  useEffect(() => {
    setMounted(true);
  }, []);

  const loading = useSelector((state: RootState) => state.loading.isLoading);

  if (loading) <Loading />;

  const handlePageChange = (e: any) => updatePageData(e.page, e.rows);
  const handleSortChange = (e: any) =>
    handleSort(e.sortField || "", e.sortOrder || 0);

  const permissions = useSelector(
    (state: any) => state.permissions.permissions
  );

  const hasPermission = (actionName: string) => {
    const resource = permissions.find((p: any) => p.resourceName === "Street");
    return resource ? resource.actionNames.includes(actionName) : false;
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete street?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(id)
          .then(() => Swal.fire("Deleted!", "", "success"))
          .catch(() =>
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete role",
              life: 3000,
            })
          );
      }
    });
  };

  return (
    <div className="main-container">
      {mounted && <Toast ref={toast} />}
      <div className="mb-5">
        {mounted ? (
          <BreadCrumbComponent name="StreetList" />
        ) : (
          <Skeleton width="100%" height="34px" />
        )}
      </div>

      <Card title="Street management">
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
                    label="Add new"
                    className="btn_add_new"
                    onClick={() => {
                      console.log("hehehe");

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
          SkeletonTemplate("Street Management", 5)
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
              field="width"
              header="Width"
              className="w-200"
              body={(row) => row.width || "-"}
            />
            <Column
              field="curbWith"
              header="Curb"
              className="w-200"
              body={(row) => row.curbWith || "-"}
            />
            <Column
              frozen={true}
              header={() => <div className="flex justify-center">Actions</div>}
              className="w-60"
              body={(row: any) => (
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
                      className="icon_edit"
                      rounded
                      text
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
                      onClick={() => handleDelete(String(row.id))}
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
        <StreetForm
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
        <StreetDetail
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
