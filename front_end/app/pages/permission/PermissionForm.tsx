import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import $axios from "~/axios";
import { Checkbox } from "antd";
import { useCommonData } from "~/hook/useCommonData";
import { toast } from "react-toastify";

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
  readonly permissionData?: any;
  readonly onClose: () => void;
  readonly loadDataTable: () => Promise<void>;
}

export default function PermissionForm({
  id,
  open = false,
  permissionData,
  onClose,
  loadDataTable,
}: Props) {
  const [actionData, setActionData] = useState<Resource[]>([]);
  const [selectedActions, setSelectedActions] = useState<{
    [key: number]: number[];
  }>({});
  const [submitting, setSubmitting] = useState(false);

  const getHeader = (): string => {
    return "EDIT PERMISSION";
  };

  const { commonData } = useCommonData(["permissions"]);
  const resourceActions = commonData.resourceActions;

  const uniqueResources = useMemo(() => {
    if (!resourceActions) return [];

    return [
      ...new Map(
        resourceActions.map((item: Resource) => [
          item.resourceId,
          {
            resourceId: item.resourceId,
            resourceName: item.resourceName,
          },
        ])
      ).values(),
    ];
  }, [resourceActions]);

  useEffect(() => {
    if (resourceActions) {
      setActionData(resourceActions);
    }
  }, [resourceActions]);

  const submit = async () => {
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
      toast.warn("Please select at least one action", {
        autoClose: 3000,
      });
      setSubmitting(false);
      return;
    }

    const mappingDTO = {
      roleId: id ? parseInt(id) : 0,
      mapResourceActionIds,
    };

    try {
      if (id) {
        await $axios.put("/permission", mappingDTO);
        toast.success("Permission updated successfully", {
          autoClose: 3000,
        });
        await loadDataTable();
      }
      onClose();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Failed to save permission", {
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (id && open && permissionData && actionData.length > 0) {
      const newSelectedActions: { [key: number]: number[] } = {};

      if (permissionData && permissionData.roleRes) {
        permissionData.roleRes.forEach((role: any) => {
          if (role.permissions && role.permissions.length > 0) {
            role.permissions.forEach((perm: Resource) => {
              const matchingAction = actionData.find(
                (action) =>
                  action.resourceId === perm.resourceId &&
                  action.actionId === perm.actionId
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
              }
            });
          }
        });
        setSelectedActions(newSelectedActions);
      } else {
        toast.error("Invalid permission data structure", {
          autoClose: 3000,
        })
      setSelectedActions({});
    }
  }}, [id, open, permissionData, actionData]);

  const onActionChange = (
    resourceId: number,
    actionId: number,
    checked: boolean
  ) => {
    setSelectedActions((prev) => {
      const currentActions = prev[resourceId] || [];
      if (checked) {
        if (!currentActions.includes(actionId)) {
          return { ...prev, [resourceId]: [...currentActions, actionId] };
        }
        return prev;
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
      <Dialog
        visible={open}
        onHide={onClose}
        header={getHeader()}
        footer={() => {
          return (
            <div className="flex justify-center gap-2">
              <Button
                label="Close"
                onClick={onClose}
                severity="secondary"
                outlined
                disabled={submitting}
                style={{ padding: "8px 40px" }}
              />
              <Button
                label="Save"
                onClick={submit}
                className="btn_submit"
                disabled={submitting}
                loading={submitting}
                style={{ padding: "8px 40px" }}
              />
            </div>
          );
        }}
        style={{ width: "50%", maxWidth: "95vw" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <DataTable value={uniqueResources} className="mt-4 p-4" key={JSON.stringify(selectedActions)}>
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
                  .filter((action) => action.resourceId === rowData.resourceId)
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
                        id={`action-${rowData.resourceId}-${action.id}`}
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
                      />
                      <label
                        htmlFor={`action-${rowData.resourceId}-${action.id}`}
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
                />
              );
            }}
          />
        </DataTable>
      </Dialog>
    </div>
  );
}
