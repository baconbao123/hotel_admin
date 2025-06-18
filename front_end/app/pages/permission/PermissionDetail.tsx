import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "antd";
import { format } from "date-fns";

interface Resource {
  id: number;
  resourceId: number;
  resourceName: string;
  actionId: number;
  actionName: string;
}

interface Role {
  roleId: number;
  roleName: string;
  permissions: Resource[];
}

interface PermissionData {
  createdBy: string | null;
  createdAt: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
  roleRes: Role[];
}

interface Props {
  id?: string;
  open: boolean;
  permissionData?: PermissionData;
  onClose: () => void;
}

export default function PermissionDetail({
  id,
  open = false,
  permissionData,
  onClose,
}: Props) {
  const [selectedActions, setSelectedActions] = useState<{
    [key: number]: number[];
  }>({});
  const toast = useRef<Toast>(null);

  const getHeader = (): string => "PERMISSION DETAILS";

  useEffect(() => {
    if (id && open && permissionData?.roleRes) {
      const newSelectedActions: { [key: number]: number[] } = {};

      permissionData.roleRes.forEach((role) => {
        if (role.permissions?.length) {
          role.permissions.forEach((perm) => {
            if (!newSelectedActions[perm.resourceId]) {
              newSelectedActions[perm.resourceId] = [];
            }
            if (!newSelectedActions[perm.resourceId].includes(perm.actionId)) {
              newSelectedActions[perm.resourceId].push(perm.actionId);
            }
          });
        }
      });

      setSelectedActions(newSelectedActions);
    } else {
      setSelectedActions({});
    }
  }, [id, open, permissionData]);

  const uniqueResources = permissionData?.roleRes
    ? Array.from(
        new Map(
          permissionData.roleRes
            .flatMap((role) => role.permissions)
            .map((perm) => [perm.resourceId, perm])
        ).values()
      )
    : [];

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={open}
        onHide={onClose}
        header={getHeader()}
        footer={
          <div className="flex justify-center gap-2">
            <Button
              outlined
              label="Close"
              onClick={onClose}
              severity="secondary"
              style={{ padding: "8px 40px" }}
            />
          </div>
        }
        style={{ maxWidth: "600px", width: "90%" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        {uniqueResources.length > 0 ? (
          uniqueResources.map((perm) => (
            <div key={perm.resourceId} className="grid grid-cols-1 gap-3 mb-4">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2">
                  <label className="font-bold w-24">Resource:</label>
                  <span>{perm.resourceName}</span>
                </div>
                <div className="flex items-start gap-2">
                  <label className="font-bold w-24">Actions:</label>
                  <span className="flex flex-wrap gap-2">
                    {permissionData?.roleRes
                      .flatMap((role) => role.permissions)
                      .filter((p) => p.resourceId === perm.resourceId)
                      .map((action) => (
                        <div
                          key={action.id}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={`action-${action.resourceId}-${action.id}`}
                            checked={(
                              selectedActions[action.resourceId] || []
                            ).includes(action.actionId)}
                            disabled
                          />
                          <label
                            htmlFor={`action-${action.resourceId}-${action.id}`}
                            className="p-checkbox-label"
                          >
                            {action.actionName}
                          </label>
                        </div>
                      ))}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No permissions available</p>
        )}

        <>
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="createdBy" className="font-bold col-span-1">
              Created By:
            </label>
            <span id="createdBy" className="col-span-2">
              {permissionData?.createdBy || "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="createdAt" className="font-bold col-span-1">
              Created At:
            </label>
            <span id="createdAt" className="col-span-2">
              {permissionData?.createdAt
                ? format(
                    new Date(permissionData?.createdAt),
                    "yyyy-MM-dd HH:mm:ss"
                  )
                : "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="updatedBy" className="font-bold col-span-1">
              Updated By:
            </label>
            <span id="updatedBy" className="col-span-2">
              {permissionData?.updatedBy || "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <label htmlFor="updatedAt" className="font-bold col-span-1">
              Updated At:
            </label>
            <span id="updatedAt" className="col-span-2">
              {permissionData?.updatedAt
                ? format(
                    new Date(permissionData?.updatedAt),
                    "yyyy-MM-dd HH:mm:ss"
                  )
                : "-"}
            </span>
          </div>
        </>
      </Dialog>
    </div>
  );
}
