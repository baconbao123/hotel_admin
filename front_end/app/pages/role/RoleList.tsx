import { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Image } from "antd";
import { Toast } from "primereact/toast";
import BreadCrumbComponent from "@/components/common/breadCrumb/BreadCrumbComponent";
import useCrud from "@/hooks/crudHook";
import RoleForm from "./RoleForm";
import noImg from "@/asset/images/no-img.png";
import styles from "@/pages/user/UserFrom.module.scss";
import Swal from "sweetalert2";
import { Tag } from "primereact/tag";
import RoleDetail from "./RoleDetail";
import { Skeleton } from "primereact/skeleton";

interface Role {
    id: number;
    name: string;
    description?: string;
    status: boolean;
}

export default function RoleList() {
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
        undefined
    );
    const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
        "create"
    );
    const toast = useRef<Toast>(null);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const {
        data,
        loading,
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
        openFormDetail,
        error,
        setopenFormDetail
    } = useCrud("/role");

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

    const statusBodyTemplate = (rowData: Role) => {
        const statusLabel = rowData.status ? "Active" : "Inactive";

        return (
            <Tag
                rounded
                value={statusLabel}
                severity={getStatusSeverity(rowData.status)}
                style={{
                    maxWidth: "5rem",
                    display: "flex",
                    justifyContent: "center",
                    padding: "0.4rem 3rem",
                }}
            />
        );
    };

    // Skeleton loading for table
    const skeletonTemplate = () => (
      <Card title="Role management">
        <DataTable value={Array(5).fill({})} tableStyle={{ minWidth: "50rem" }} showGridlines className="p-datatable-striped">
          <Column field="id" body={<Skeleton width="100%" height="2rem" />} />
          <Column field="name"  body={<Skeleton width="100%" height="2rem" />} />
          <Column field="description"  body={<Skeleton width="100%" height="2rem" />} />
          <Column field="status"  body={<Skeleton width="100%" height="2rem" />} />
          <Column  body={<Skeleton width="100%" height="2rem" />} />
        </DataTable>
      </Card>
    );

    return (
        <div>
            {mounted && <Toast ref={toast} />}

            <div className="mb-5">
             
               {mounted ? (   <BreadCrumbComponent name="RoleList" />) : (<Skeleton  width="100%" height="34px"  />)} 
            </div>

            <div className="mb-5">
                <div className="grid grid-cols-4 gap-10 card">
                    <div className="col-span-4 2xl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3">
                        <div className="grid gap-2 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
                          {mounted ? (   <div>

                             <InputText
                                placeholder="Name"
                                className="w-full"
                                value={searchFilters.name || ""}
                                onChange={(e) =>
                                    handleSearchChange("name", e.target.value)
                                }
                            />
                          </div>) : (<div>
                            <Skeleton  height="100%"/>
                          </div>)} 
                           
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

            {loading ? skeletonTemplate() : (
              <Card title="Role management">
                <DataTable
                    value={data}
                    tableStyle={{ minWidth: "50rem" }}
                    paginator
                    rows={pageSize}
                    showGridlines
                    rowHover
                    lazy
                    rowsPerPageOptions={[1, 5, 10, 25, 30]}
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
                    <Column
                        sortable
                        field="id"
                        header="Id"
                        className="w-20"
                    ></Column>
                    <Column sortable field="name" header="Name"></Column>
                    <Column field="description" header="Description" body={(rowData) => (
                      <div>{rowData.description ? rowData.description : '-'}</div>
                    )}></Column>

                    <Column
                        field="status"
                        header="Status"
                        sortable
                        className="text-center w-50"
                        body={(rowData) => (
                            <div className="flex justify-center">
                                {statusBodyTemplate(rowData)}
                            </div>
                        )}
                    ></Column>

                    <Column
                        header={() => (
                          <div className="flex justify-center">
                            Actions
                          </div>
                        )}
                        className="w-60"
                        body={(rowData: any) => (
                            <div className="flex gap-2 justify-center">
                                <Button
                                    icon="pi pi-eye"
                                    rounded
                                    text
                                    severity="info"
                                    onClick={() => {
                                        setSelectedUserId(rowData.id);
                                        setFormMode("view");
                                        setopenFormDetail(true);
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
            )}

            <RoleForm
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
                error={error}
            />
            <RoleDetail
                id={selectedUserId}
                open={openFormDetail}
                mode={formMode}
                onClose={() => {
                    setopenFormDetail(false);
                    setSelectedUserId(undefined);
                    setFormMode("view");
                }}
                loadDataTable={loadDataTable}
                loadDataById={loadDataById}
                createItem={createItem}
                updateItem={updateItem}
                error={error}
            />
        </div>
    );
}
