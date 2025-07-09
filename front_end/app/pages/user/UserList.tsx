import { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Image } from "antd";
import BreadCrumbComponent from "~/components/common/breadCrumb/BreadCrumbComponent";
import useCrud from "~/hook/crudHook";
import Swal from "sweetalert2";
import { Tag } from "primereact/tag";
import UserDetail from "./UserDetail";
import { Skeleton } from "primereact/skeleton";
import { SkeletonTemplate } from "~/components/common/skeleton";
import noImg from "@/asset/images/no-img.png";
// import UserForm from "./UserForm";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "~/store";
import { fetchCommonData } from "~/store/slice/commonDataSlice";
import { toast } from "react-toastify";
import type { Route } from "./+types/UserList";
import UserForm from "./UserForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User" },
    { name: "description", content: "Hotel Admin User" },
  ];
}

export default function UserList() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );
  const [mounted, setMounted] = useState(false);

  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  const dispatch = useAppDispatch();


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
    permissionPage
  // } = useCrud("/user", undefined, undefined, 'User');
  } = useCrud("/user");


  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div>
      <div className="mb-5">
        {mounted ? (
          <BreadCrumbComponent name="UserList" />
        ) : (
          <Skeleton width="100%" height="34px" />
        )}
      </div>

      <Card title="Users management">
        <div className="mb-5">
          <div className="grid grid-cols-4 gap-10 card">
            <div className="col-span-4 2xl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3">
              <div className="grid gap-2 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
                {mounted ? (
                  <InputText
                    placeholder="Name"
                    className="w-full"
                    value={filters.fullName || ""}
                    onChange={(e) => handleSearch("fullName", e.target.value)}
                  />
                ) : (
                  <Skeleton height="100%" />
                )}

                {mounted ? (
                  <InputText
                    placeholder="Email"
                    className="w-full"
                    value={filters.email || ""}
                    onChange={(e) => handleSearch("email", e.target.value)}
                  />
                ) : (
                  <Skeleton height="100%" />
                )}
              </div>
            </div>

            <div className="col-span-4 2xl:col-span-1 xl:col-span-1 lg:col-span-1 md:col-span-1">
              <div className="flex flex-wrap gap-2 justify-end">
                <Button
                  label="Add new"
                  className="btn_add_new"
                  onClick={() => {
                    setSelectedUserId(undefined);
                    setOpenForm(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {tableLoading ? (
          SkeletonTemplate("User Management", 5)
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
            <Column sortable field="id" header="Id" className="w-20"></Column>
            <Column
              field="avatarUrl"
              header="Avatar"
              className="w-30"
              body={(rowData: any) => {
                return (
                  <div className="flex justify-center">
                    {rowData.avatarUrl ? (
                      <Image
                        src={`${
                          import.meta.env
                            .VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
                        }/${rowData.avatarUrl}`}
                        alt="User Avatar"
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
            ></Column>

            <Column sortable field="fullName" header="Name"></Column>
            <Column sortable field="email" header="Email"></Column>
            <Column
              field="status"
              header="Status"
              sortable
              body={statusBody}
              className=" w-40"
            ></Column>
            <Column
              header="Actions"
              className="w-60"
              body={(row: any) => (
                <div className="flex gap-2 justify-center">
                  {permissionPage.view && (
                    <Button
                      icon="pi pi-eye"
                      className="icon_view"
                      rounded
                      text
                      onClick={() => {
                        setSelectedUserId(row.id);
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
                        setSelectedUserId(row.id);
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
                              toast.error("Failed to refresh room data", {
                                autoClose: 3000
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
            ></Column>
          </DataTable>
        )}
      </Card>

      {(permissionPage.create || permissionPage.update) && (
        <UserForm
          id={selectedUserId}
          open={openForm}
          mode={formMode}
          onClose={() => {
            setOpenForm(false);
            setSelectedUserId(undefined);
            setFormMode("create");
          }}
          loadDataById={loadById}
          createItem={createItem}
          updateItem={updateItem}
          error={error}
        />
      )}

      {permissionPage.view && (
        <UserDetail
          id={selectedUserId}
          open={openFormDetail}
          mode={formMode}
          onClose={() => {
            setOpenFormDetail(false);
            setSelectedUserId(undefined);
            setFormMode("view");
          }}
          loadDataById={loadById}
        />
      )}
    </div>
  );
}
