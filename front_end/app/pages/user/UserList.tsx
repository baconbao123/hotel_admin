import type { Route } from "../../+types/root";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { BreadCrumb } from "primereact/breadcrumb";

import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import BreadCrumbComponent from "@/components/common/breadCrumb/BreadCrumbComponent";
import useCrud from "@/hooks/crudHook";
import UserForm from "./UserForm";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Portal Hotel - Users management" },
        { name: "description", content: "" },
    ];
}

export default function UserList() {

    const { data, loading, createItem, updateItem, deleteItem, setopenForm, openForm, loadDataTable } = useCrud('/street/get-all')
    const paginatorLeft = <Button type="button" severity="secondary" icon="pi pi-refresh" text onClick={() => alert("click in the button")} />;
    const handlePageChange = (event: any) =>  {
        console.log("check event ", event);
    }

    return (
        <div>
            <div  className="mb-5">
                {/* Start breadcrumb */}
                <BreadCrumbComponent name="UserList" />
                {/* End breadcrumb */}

            </div>

            <div className="mb-5">
                <div className="grid grid-cols-4 gap-10 card">
                    <div className="col-span-4 2xl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 ">
                        <div className="grid  gap-2 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
                            {/* Start search */}
                            <InputText
                                placeholder="Integers"
                                className="w-full"
                            />
                            <InputText
                                placeholder="Integers"
                                className="w-full"
                            />
                            {/* End  search */}
                        </div>
                    </div>

                    <div className=" col-span-4 2xl:col-span-1 xl:col-span-1 lg:col-span-1 md:col-span-1 ">
                        <div className="flex flex-wrap  gap-2 justify-end">
                            {/* Start button */}
                            <Button className=" me-2" label="Add new" onClick={() => setopenForm(true)} />
                            <Button
                                className=" me-2"
                                label="Export excel"
                            />
                            {/* End button */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Start table */}
            <Card title="Users management">
                <DataTable
                    value={data}
                    tableStyle={{ minWidth: "50rem" }}
                    paginator
                    rows={5}
                    showGridlines 
                    rowHover
                    lazy
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="From {first}  to  {last}  of  {totalRecords}"
                    paginatorLeft={paginatorLeft}
                    totalRecords={data.length}
                    onPage={handlePageChange}
                >
                    <Column sortable  field="code" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                </DataTable>
            </Card>
            {/* End table */}

            {/* Start Form  Add & Edit*/}
            <UserForm open={openForm} onClose={() => setopenForm(false)} loadDataTable={() => loadDataTable} />
            {/* Start Form Add & Edit */}

        </div>
    );
}
