import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import type { CalendarEvent } from "@/types/calendar";
import type { BookingFormData, BookingStatus, Room } from "@/types/booking";
import type { BookingData } from '@/types/booking';
import "../../styles/calendar.scss";

interface BusinessCalendarProps {
  events: BookingData[];
  createDialogContent?: React.ReactNode;
  viewDialogContent?: React.ReactNode;
  editDialogContent?: React.ReactNode;
  onEventCreate: (data: BookingFormData) => Promise<void>;
  onEventUpdate?: (event: CalendarEvent) => Promise<void>;
  onEventDelete?: (eventId: string) => Promise<void>;
  customEventRender?: (event: CalendarEvent) => React.ReactNode;
  allowedViews?: ("dayGridMonth" | "timeGridWeek" | "timeGridDay")[];
  validateDateSelection?: (start: Date, end: Date) => boolean | string;
  eventColors?: Record<string, string>;
  businessHours?: {
    startTime: string;
    endTime: string;
    daysOfWeek?: number[];
  };
}

export default function BusinessCalendar({
  events,
  ...props
}: BusinessCalendarProps) {
  const {
    createDialogContent,
    viewDialogContent,
    editDialogContent,
    onEventCreate,
    onEventUpdate,
    onEventDelete,
    customEventRender,
    allowedViews = ["dayGridMonth", "timeGridWeek"],
    validateDateSelection,
    eventColors = {},
    businessHours,
  } = props;

  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>(events);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedDates, setSelectedDates] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    console.log("Calendar events:", events);
  }, [events]);

  const handleDateSelect = (selectInfo: any) => {
    if (validateDateSelection) {
      const validationResult = validateDateSelection(
        selectInfo.start,
        selectInfo.end
      );
      if (typeof validationResult === "string") {
        toast.current?.show({
          severity: "error",
          summary: "Invalid Selection",
          detail: validationResult,
          life: 3000,
        });
        return;
      }
    }

    setSelectedDates({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setShowCreateDialog(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setShowViewDialog(true);
  };

  const handleEventDrop = async (dropInfo: any) => {
    if (onEventUpdate && selectedEvent) {
      try {
        await onEventUpdate({
          ...selectedEvent,
          start: dropInfo.event.start,
          end: dropInfo.event.end,
        });

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Event updated successfully",
          life: 3000,
        });
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update event",
          life: 3000,
        });
        dropInfo.revert();
      }
    }
  };

  const renderDialogFooter = (onClose: () => void, onConfirm?: () => void) => (
    <div className="flex justify-end gap-2">
      <Button
        label="Close"
        icon="pi pi-times"
        onClick={onClose}
        className="p-button-text"
      />
      {onConfirm && (
        <Button label="Confirm" icon="pi pi-check" onClick={onConfirm} />
      )}
    </div>
  );

  return (
    <div className="business-calendar card">
      <Toast ref={toast} />

      <div className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          views={{
            dayGridMonth: {
              dayMaxEventRows: 4,
              dayHeaderFormat: { weekday: "short" },
            },
            timeGridWeek: {
              slotDuration: "01:00:00",
              slotLabelFormat: {
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              },
            },
          }}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          firstDay={1}
          stickyHeaderDates={true}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          events={currentEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          businessHours={businessHours}
          eventContent={customEventRender}
        />
      </div>

      {/* Create Dialog */}
      <Dialog
        visible={showCreateDialog}
        onHide={() => setShowCreateDialog(false)}
        header="Create New Event"
        modal
        style={{ width: "450px" }}
        footer={renderDialogFooter(
          () => setShowCreateDialog(false),
          () => {
            /* Handle create confirmation */
          }
        )}
      >
        {createDialogContent}
      </Dialog>

      {/* View Dialog */}
      <Dialog
        visible={showViewDialog}
        onHide={() => setShowViewDialog(false)}
        header="View Event"
        modal
        style={{ width: "450px" }}
        footer={renderDialogFooter(() => setShowViewDialog(false))}
      >
        {viewDialogContent}
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        header="Edit Event"
        modal
        style={{ width: "450px" }}
        footer={renderDialogFooter(
          () => setShowEditDialog(false),
          () => {
            /* Handle edit confirmation */
          }
        )}
      >
        {editDialogContent}
      </Dialog>
    </div>
  );
}
