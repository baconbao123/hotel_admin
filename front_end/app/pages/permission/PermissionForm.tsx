import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import $axios from "@/axios";
import { Checkbox } from "antd";

interface Resource {
  id: number;
  resourceId: number;
  resourceName: string;
  actionId: number;
  actionName: string;
}

interface Props {
  readonly id?: string;
  readonly open: boolean;
  readonly mode?: "edit" | "view";
  readonly permissionData?: any;
  readonly onClose: () => void;
  readonly loadDataTable: () => Promise<void>;
}

export default function PermissionForm({
  id,
  open = false,
  mode = "edit",
  permissionData,
  onClose,
  loadDataTable,
}: Props) {
  const [resourceData, setResourceData] = useState<Resource[]>([]);
  const [actionData, setActionData] = useState<Resource[]>([]);
  const [selectedActions, setSelectedActions] = useState<{
    [key: number]: number[];
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useRef<Toast>(null);

  const getHeader = (): string => {
    switch (mode) {
      case "view":
        return "PERMISSION DETAILS";
      case "edit":
        return "EDIT PERMISSION";
      default:
        return "EDIT PERMISSION";
    }
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        label="Close"
        onClick={onClose}
        className="p-button-text"
        disabled={submitting}
      />
      {mode !== "view" && (
        <Button
          label="Save"
          type="submit"
          form="permission-form"
          className="p-button-text"
          loading={submitting}
        />
      )}
    </div>
  );

  const submitData = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const mapResourceActionIds: number[] = [];

    Object.entries(selectedActions).forEach(([resourceId, actionIds]) => {
      actionIds.forEach((actionId) => {
        const matchingAction = actionData.find(
          (action) =>
            action.resourceId === parseInt(resourceId) &&
            action.actionId === actionId
        );
        if (matchingAction) {
          mapResourceActionIds.push(matchingAction.id);
        }
      });
    });

    if (mapResourceActionIds.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please select at least one action",
        life: 3000,
      });
      setSubmitting(false);
      return;
    }

    const mappingDTO = {
      roleId: id ? parseInt(id) : 0,
      mapResourceActionIds,
    };

    try {
      if (id && mode === "edit") {
        await $axios.put("/permission", mappingDTO);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Permission updated successfully",
          life: 3000,
        });
        await loadDataTable();
      }
      onClose();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to save permission",
        life: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await $axios("/permission/resource-actions");
        const data = response.data.result || [];
        const uniqueResources = Array.from(
          new Map(
            data.map((item: Resource) => [item.resourceId, item])
          ).values()
        );
        setResourceData(uniqueResources);
        setActionData(data);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load resources or actions",
          life: 3000,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (
      id &&
      open &&
      mode === "edit" &&
      permissionData &&
      actionData.length > 0
    ) {
      const newSelectedActions: { [key: number]: number[] } = {};

      if (permissionData && permissionData.roleRes) {
        permissionData.roleRes.forEach((role: any) => {
          if (role.permissions && role.permissions.length > 0) {
            role.permissions.forEach((perm: Resource) => {
              const matchingAction = actionData.find(
                (action) => action.id === perm.id
              );

              if (matchingAction) {
                if (!newSelectedActions[perm.resourceId]) {
                  newSelectedActions[perm.resourceId] = [];
                }
                if (
                  !newSelectedActions[perm.resourceId].includes(
                    matchingAction.actionId
                  )
                ) {
                  newSelectedActions[perm.resourceId].push(
                    matchingAction.actionId
                  );
                }
              } else {
                console.warn(
                  `No matching action found for mapResourceActionId: ${perm.id}`
                );
              }
            });
          } else {
            console.warn("No permissions found for role:", role);
          }
        });

        setSelectedActions(newSelectedActions);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Invalid permission data structure",
          life: 3000,
        });
      }
    } else {
      setSelectedActions({});
    }
  }, [id, open, mode, permissionData, actionData]);

  const onActionChange = (
    resourceId: number,
    actionId: number,
    checked: boolean
  ) => {
    setSelectedActions((prev) => {
      const currentActions = prev[resourceId] || [];
      if (checked) {
        return { ...prev, [resourceId]: [...currentActions, actionId] };
      } else {
        return {
          ...prev,
          [resourceId]: currentActions.filter((id) => id !== actionId),
        };
      }
    });
  };

  const onAllChange = (resourceId: number, checked: boolean) => {
    setSelectedActions((prev) => {
      if (checked) {
        const allActionIds = actionData
          .filter((action) => action.resourceId === resourceId)
          .map((action) => action.actionId);
        return { ...prev, [resourceId]: allActionIds };
      } else {
        return { ...prev, [resourceId]: [] };
      }
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={open}
        onHide={onClose}
        header={getHeader()}
        footer={footer}
        style={{ width: "50%" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <form id="permission-form" onSubmit={submitData}>
          <DataTable value={resourceData} className="mt-4">
            <Column
              field="resourceName"
              header="Resource"
              body={(rowData) => rowData.resourceName}
            />
            <Column
              header="Action"
              body={(rowData) => (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {actionData
                    .filter(
                      (action) => action.resourceId === rowData.resourceId
                    )
                    .map((action) => (
                      <div
                        key={action.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <Checkbox
                          id={`action-${rowData.id}-${action.id}`}
                          checked={(
                            selectedActions[rowData.resourceId] || []
                          ).includes(action.actionId)}
                          onChange={(e) =>
                            onActionChange(
                              rowData.resourceId,
                              action.actionId,
                              e.target.checked
                            )
                          }
                          disabled={mode === "view"}
                        />
                        <label
                          htmlFor={`action-${rowData.id}-${action.id}`}
                          className="p-checkbox-label"
                        >
                          {action.actionName}
                        </label>
                      </div>
                    ))}
                </div>
              )}
            />
            <Column
              header="All"
              body={(rowData) => {
                const resourceId = rowData.resourceId;
                const allActionIds = actionData
                  .filter((action) => action.resourceId === resourceId)
                  .map((action) => action.actionId);
                const isAllChecked =
                  allActionIds.length > 0 &&
                  allActionIds.every((actionId) =>
                    (selectedActions[resourceId] || []).includes(actionId)
                  );
                return (
                  <Checkbox
                    checked={isAllChecked}
                    onChange={(e) => onAllChange(resourceId, e.target.checked)}
                    disabled={mode === "view"}
                  />
                );
              }}
            />
          </DataTable>
        </form>
      </Dialog>
    </div>
  );
}
