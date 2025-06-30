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

  const getHeader = (): string => "DETAILS";

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
        style={{ width: "50%" }}
        modal
        className="p-fluid"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        {uniqueResources.length > 0 ? (
          uniqueResources.map((perm) => (
            <div
              key={perm.resourceId}
              className="grid grid-cols-1 gap-3 mb-4 pl-4 pr-4"
            >
              <div className="resouce_actions">
                <div className="w-127">
                  <label className="font-bold w-24">Resource:</label>
                  <div>{perm.resourceName}</div>
                </div>
                <div>
                  <label className="font-bold w-24">Actions:</label>
                  <div className="flex flex-wrap gap-2">
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
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>-</p>
        )}

        {/* Info data create/update */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-4 pr-4">
          {/* Left */}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="createdName" className="font-bold block mb-1">
                Created By:
              </label>
              <span id="createdName">{permissionData?.createdBy || "-"}</span>
            </div>

            <div>
              <label htmlFor="createdAt" className="font-bold block mb-1">
                Created At:
              </label>
              <span id="createdAt">
                {permissionData?.createdAt
                  ? format(
                      new Date(permissionData?.createdAt),
                      "yyyy-MM-dd HH:mm:ss"
                    )
                  : "-"}
              </span>
            </div>
          </div>
          {/* Right */}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="updatedName" className="font-bold block mb-1">
                Updated By:
              </label>
              <span id="updatedName">{permissionData?.updatedBy || "-"}</span>
            </div>

            <div>
              <label htmlFor="createdAt" className="font-bold block mb-1">
                Update At:
              </label>
              <span id="createdAt">
                {permissionData?.updatedAt
                  ? format(
                      new Date(permissionData?.updatedAt),
                      "yyyy-MM-dd HH:mm:ss"
                    )
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
