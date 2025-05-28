import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface Props {
    readonly id?: string;
    readonly open: boolean;
    readonly onClose: () => void;
    readonly loadDataTable: () => void;
}

export default function UserForm({
    id,
    open = false,
    onClose,
    loadDataTable,
}: Props) {
    const footer = (
        <div className="flex justify-end gap-2">
            <Button onClick={onClose} className="p-button-text" />
            <Button onClick={onClose} className="p-button-text" />
        </div>
    );

    const getHeader = (): string => {
        if (id) {
            return 'EDIT  USER'
        }
        return 'ADD NEW USER' 
    }
    return (
        <div>
            <Dialog
                visible={open}
                onHide={onClose}
                header={getHeader()}
                footer={footer}
                style={{ width: '50%' }}
                modal
                className="p-fluid"
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            >
                "Hello world"
            </Dialog>
        </div>
    );
}
