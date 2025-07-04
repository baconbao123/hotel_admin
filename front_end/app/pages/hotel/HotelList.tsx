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
import { Image } from "antd";
import noImg from "@/asset/images/no-img.png";
import UserForm from "../user/UserForm";
import HotelForm from "./HotelForm";
import HotelDetail from "./HotelDetail";
import { useSelector } from "react-redux";

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
  } = useCrud("/hotel");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePageChange = (e: any) => updatePageData(e.page, e.rows);
  const handleSortChange = (e: any) =>
    handleSort(e.sortField || "", e.sortOrder || 0);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete role?",
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

  const hasPermission = (actionName: string) => {
    const resource = permissions.find((p: any) => p.resourceName === "Hotel");
    console.log(permissions);

    return resource ? resource.actionNames.includes(actionName) : false;
  };

  return (
    <div className="main-container">
      {mounted && <Toast ref={toast} />}
      <div className="mb-5">
        {mounted ? (
          <BreadCrumbComponent name="HotelList" />
        ) : (
          <Skeleton width="100%" height="34px" />
        )}
      </div>

      <Card title="Hotel management">
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
                <Button
                  label="Add new"
                  className="btn_add_new"
                  onClick={() => {
                    setSelectedId(undefined);
                    setFormMode("create");
                    setOpenForm(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {tableLoading ? (
          SkeletonTemplate("Hotel Management", 6)
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
            <Column
              sortable
              field="avatarUrl"
              header="Avatar"
              body={(row: any) => {
                return (
                  <div className="flex justify-center">
                    {row.avatarUrl ? (
                      <Image
                        src={`${
                          import.meta.env.VITE_REACT_APP_BACK_END_UPLOAD_HOTEL
                        }/${row.avatarUrl}`}
                        width={50}
                        height={50}
                        style={{
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        preview
                      />
                    ) : (
                      <Image src={noImg} />
                    )}
                  </div>
                );
              }}
              className="w-20"
            />
            <Column sortable field="name" header="Name" className="w-200" />
            <Column
              sortable
              field="ownerName"
              header="ownerName"
              className="w-200"
              body={(row) => row.ownerName || "-"}
            />
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
                      className="icon_view"
                      rounded
                      text
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

      <HotelForm
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

      <HotelDetail
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
    </div>
  );
}
