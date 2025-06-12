import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Image } from "antd";
import { Toast } from "primereact/toast";
import BreadCrumbComponent from "@/components/common/breadCrumb/BreadCrumbComponent";
import useCrud from "@/hooks/crudHook";
import UserForm from "./UserForm";
import noImg from "@/asset/images/no-img.png";
import styles from "@/pages/user/UserFrom.module.scss";
import Swal from "sweetalert2";
import { Tag } from "primereact/tag";


interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
  status: boolean;
}

export default function UserList() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const toast = useRef<Toast>(null);

  const {
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
    sortField,
    sortOrder,
  } = useCrud("/user");

  const paginatorLeft = (
    <Button
      type="button"
      severity="secondary"
      icon="pi pi-refresh"
      text
      onClick={() => resetFilters()}
    />
  );

  const handlePageChange = (event: any) => {
    const newPage = event.page;
    const newPageSize = event.rows;
    updatePageData(newPage, newPageSize);
  };

  const handleSortChange = (e: any) => {
    if (e.sortField) {
      handleSort(e.sortField, e.sortOrder);
    } else {
      handleSort("", 0); // Reset sort
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Do you want to delete user?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(id)
          .then(() => {
            Swal.fire("Deleted!", "", "success");
          })
          .catch(() => {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete user",
              life: 3000,
            });
          });
      }
    });
  };

  // thêm cột trạng thái
  const getStatusSeverity = (status: boolean) => {
    return status ? "success" : "danger";
  };

  const statusBodyTemplate = (rowData: User) => {
    const statusLabel = rowData.status ? "Active" : "Inactive";

    return (
      <Tag
        value={statusLabel}
        severity={getStatusSeverity(rowData.status)}
        style={{
          maxWidth: "5rem",
          display: "flex",
          justifyContent: "center",
          padding: "0.3rem 0.6rem",
        }}
      />
    );
  };

  return (
    <div>
      <Toast ref={toast} />

      <div className="mb-5">
        <BreadCrumbComponent name="UserList" />
      </div>

      <div className="mb-5">
        <div className="grid grid-cols-4 gap-10 card">
          <div className="col-span-4 2xl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3">
            <div className="grid gap-2 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
              <InputText
                placeholder="Search by name"
                className="w-full"
                value={searchFilters.fullName || ""}
                onChange={(e) => handleSearchChange("fullName", e.target.value)}
              />
              <InputText
                placeholder="Search by email"
                className="w-full"
                value={searchFilters.email || ""}
                onChange={(e) => handleSearchChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="col-span-4 2xl:col-span-1 xl:col-span-1 lg:col-span-1 md:col-span-1">
            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                className="me-2"
                label="Add new"
                onClick={() => {
                  setSelectedUserId(undefined);
                  setopenForm(true);
                }}
              />
              <Button className="me-2" label="Export excel" />
            </div>
          </div>
        </div>
      </div>

      <Card title="Users management">
        <DataTable
          value={data}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          rows={pageSize}
          showGridlines
          rowHover
          lazy
          loading={loading}
          rowsPerPageOptions={[1, 5, 10, 25, 30]} // Added 1
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
          <Column sortable field="id" header="Id"></Column>
          <Column
            field="avatarUrl"
            header="Avatar"
            body={(rowData: any) => {
              return rowData.avatarUrl ? (
                <Image
                  src={`${
                    import.meta.env.VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
                  }/${rowData.avatarUrl}`}
                  alt="User Avatar"
                  width={50}
                  height={50}
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                  preview
                />
              ) : (
                <Image src={noImg} width={50} height={50} />
              );
            }}
          ></Column>
          <Column sortable field="fullName" header="Name"></Column>
          <Column sortable field="email" header="Email"></Column>
          <Column
            field="status"
            header="Status"
            sortable
            body={statusBodyTemplate}
            style={{ width: "12%", textAlign: "center" }}
          ></Column>
          <Column
            header="Actions"
            style={{ width: "15%" }}
            body={(rowData: any) => (
              <div className="flex gap-2 ">
                <Button
                  icon="pi pi-eye"
                  rounded
                  text
                  severity="info"
                  onClick={() => {
                    setSelectedUserId(rowData.id);
                    setFormMode("view");
                    setopenForm(true);
                  }}
                  tooltip="View"
                  tooltipOptions={{ position: "top" }}
                />
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="success"
                  onClick={() => {
                    setSelectedUserId(rowData.id);
                    setFormMode("edit");
                    setopenForm(true);
                  }}
                  tooltip="Edit"
                  tooltipOptions={{ position: "top" }}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  onClick={() => handleDelete(rowData.id)}
                  tooltip="Delete"
                  tooltipOptions={{ position: "top" }}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </Card>

      <UserForm
        id={selectedUserId}
        open={openForm}
        mode={formMode}
        onClose={() => {
          setopenForm(false);
          setSelectedUserId(undefined);
          setFormMode("create");
        }}
        loadDataTable={loadDataTable}
        loadDataById={loadDataById}
        createItem={createItem}
        updateItem={updateItem}
      />
    </div>
  );
}
