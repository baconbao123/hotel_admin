import type { Route } from "../../+types/root";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useToastPrime } from "@/hooks/use-toast-prime";
import { Modal } from "@/components/shared/Modal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Hotel Admin Dashboard" },
  ];
}

export default function Dashboard() {
  const { toast, showSuccess, showError } = useToastPrime();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      console.log("Dashboard component mounting - Start");
      console.log("Current route:", window.location.pathname);
      console.log("Modal state:", showModal);
      console.log("Toast state:", toast);
      console.log("Current component state:", { showModal });
    } catch (error) {
      console.error("Error in Dashboard mounting:", error);
    }
  }, [showModal, toast]);

  const handleSomeAction = () => {
    showSuccess("Success!", "Test toast message");
  };

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const products = [
    {
      code: "pd1001",
      name: "Bamboo Watch",
      category: "Accessories",
      quantity: 24,
    },
    {
      code: "nvklal433",
      name: "Black Watch",
      category: "Accessories",
      quantity: 0,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"> This is Welcome</h1>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-32">Total Rooms:</span>
            <span className="font-medium">50</span>
          </li>
          <li className="flex items-center">
            <span className="w-32">Available Rooms:</span>
            <span className="font-medium">30</span>
          </li>
          <li className="flex items-center">
            <span className="w-32">Bookings Today:</span>
            <span className="font-medium">5</span>
          </li>
        </ul>
      </div>

      <Toast ref={toast} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Modal Title"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        onConfirm={handleShowModal}
        confirmIcon="pi pi-check"
        cancelIcon="pi pi-times"
        showFooter={true}
      >
        <div className="card">
          <DataTable value={products} tableStyle={{ minWidth: "50rem" }}>
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
