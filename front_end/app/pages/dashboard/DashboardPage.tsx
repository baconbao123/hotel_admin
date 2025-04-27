import type { Route } from "../../+types/root";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { useToastPrime } from "@/hooks/use-toast-prime";
import { Modal } from "@/components/shared/Modal";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
        
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Hotel Admin Dashboard" },
  ];
}

export default function Dashboard() {
  const { toast, showSuccess, showError } = useToastPrime();

  const handleSomeAction = () => {
    showSuccess("Success!", "Test toast message");
  };

  const handleShowModal = () => {
  setShowModal(!showModal);
  };
  const [showModal, setShowModal] = useState(false);
  const products = [
    {
        code: 'pd1001',
        name: 'Bamboo Watch',
        category: 'Accessories',
        quantity: 24,
      },
      {
        code: 'nvklal433',
        name: 'Black Watch',
        category: 'Accessories',
        
      }];
  return (
    
    <div>
      <h1>This is Dashboard</h1>
      <div>
        <h2>Quick Stats</h2>
        <ul>
          <li>Total Rooms: 50</li>
          <li>Available Rooms: 30</li>
          <li>Bookings Today: 5</li>
        </ul>
      </div>
      <Toast ref={toast} />
      {/* Su dung modal component */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        title="Modal Title"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        onConfirm={handleShowModal}
        confirmIcon="pi pi-check"
        cancelIcon="pi pi-times"
        showFooter={true}
      >
        <div className="card">
            <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
                <Column field="code" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="quantity" header="Quantity"></Column>
            </DataTable>
        </div>
      </Modal>
      <div className="flex gap-3">
        <Button
          onClick={handleSomeAction}
          severity="info"
          label="Show Toast"
          icon="pi pi-bell"
        />
        <Button
          onClick={handleShowModal}
          severity="info"
          label="Show Modal"
          icon="pi pi-external-link"
        />
      </div>
    </div>
  );
}
