"use client";
import React, { useEffect, useState } from "react";
import CustomToolbar from "../_components/CustomToolbar";
import CustomWeekHeader from "../_components/CustomWeekHeader";
import CustomGutterTimeWrapper from "../_components/CustomGutterTimeWrapper";
import CustomTimeSlotWrapper from "../_components/CustomTimeSlotWrapper";
import CustomDayColumnWrapper from "../_components/CustomDayColumnWrapper";
import {
  Calendar,
  EventProps,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useUserStore } from "@/store/useUserStore";
import { CalendarEvent, TabNavigateProps } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { getCookie } from "@/utils/getCookie";
import axios from "axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
} from "@heroui/react";
import NProgress from "nprogress";

const localizer = momentLocalizer(moment);

function CalendarComponent({ userDetails }: TabNavigateProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { resolvedTheme } = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setEmail = useUserStore((s) => s.setEmail);
  const setUserName = useUserStore((s) => s.setUserName);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  useEffect(() => {
    if (userDetails) {
      setEmail(userDetails.email);
      setUserName(userDetails.username);
    }
  }, []);
  useEffect(() => {
    fetchEvents(currentDate);
  }, [currentDate]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onOpen();
  };

  const fetchEvents = async (date: Date) => {
    try {
      NProgress.start();
      const token = getCookie("token");
      const fromDate = moment(date).startOf("week").format("DD/MM/YYYY");
      const toDate = moment(date).endOf("week").format("DD/MM/YYYY");

      const res = await axios.post(
        `${process.env.host}/calendar/getCalendarDetails`,
        { fromDate, toDate },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const fetched = res.data?.data ?? [];

      if (Array.isArray(fetched)) {
        const mapped: CalendarEvent[] = fetched.map((item: any) => {
          const start = new Date(item.start);
          const end = new Date(item.end);
          const adjustedEnd =
            start.getTime() === end.getTime()
              ? new Date(start.getTime() + 30 * 60 * 1000)
              : end;

          return {
            id: item.id,
            title: item.title || "Untitled",
            start,
            end: adjustedEnd,
          };
        });
        setEvents(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch calendar events:", err);
    }finally{
      NProgress.done();
    }
  };

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  const themes = {
    light: {
      bg: "#6457F9",
      border: "#4338CA",
      text: "#FFFFFF",
      subText: "#E0DFFF",
      shadow: "0 2px 6px rgba(100,87,249,0.3)",
    },
    dark: {
      bg: "#8B5CF6",
      border: "#6D28D9",
      text: "#FFFFFF",
      subText: "#DDD6FE",
      shadow: "0 2px 6px rgba(139,92,246,0.4)",
    },
  };

  const t = resolvedTheme === "dark" ? themes.dark : themes.light;

  const CustomEvent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
    const isSameDay = moment(event.start).isSame(moment(event.end), "day");

    return (
      <>
        <div
          style={{
            backgroundColor: t.bg,
            borderLeft: `3px solid ${t.border}`,
            borderRadius: "5px",
            boxShadow: t.shadow,
            padding: "3px 6px",
            height: "100%",
            overflow: "hidden",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <div
            style={{
              fontSize: "0.82rem",
              fontWeight: "700",
              color: t.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {event.title}
          </div>
          {"description" in event && (event as any).description && (
            <div
              style={{
                fontSize: "0.72rem",
                color: t.subText,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {(event as any).description}
            </div>
          )}

          <div
            style={{
              fontSize: "0.7rem",
              color: t.subText,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isSameDay
              ? `${moment(event.start).format("h:mm A")} – ${moment(event.end).format("h:mm A")}`
              : `${moment(event.start).format("MMM D")} – ${moment(event.end).format("MMM D")}`}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        date={currentDate}
        onNavigate={handleNavigate}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent,
          week: {
            header: CustomWeekHeader,
          },
          timeSlotWrapper: CustomTimeSlotWrapper,
          timeGutterHeader: CustomGutterTimeWrapper,
          timeGutterWrapper: CustomGutterTimeWrapper,
          dayColumnWrapper: CustomDayColumnWrapper,
        }}
        formats={{
          timeGutterFormat: (date) => moment(date).format("h A"),
        }}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: t.bg }}
                  />
                  <span className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary truncate">
                    {selectedEvent?.title || "Untitled"}
                  </span>
                </div>
              </ModalHeader>

              <ModalBody className="py-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider">
                    Date & Time
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Chip
                      size="sm"
                      variant="flat"
                      classNames={{
                        base: "bg-light-borderSecondary dark:bg-dark-backgroundColor",
                        content:
                          "text-light-textPrimary dark:text-dark-textPrimary font-medium",
                      }}
                    >
                      {moment(selectedEvent?.start).format("ddd, MMM D YYYY")}
                    </Chip>
                    <span className="text-light-textMuted dark:text-dark-textMuted text-sm">
                      {moment(selectedEvent?.start).format("h:mm A")}
                      {" – "}
                      {moment(selectedEvent?.end).format("h:mm A")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider">
                    Description
                  </p>
                  <p className="text-sm text-light-textPrimary dark:text-dark-textPrimary leading-relaxed min-h-[3rem]">
                    {selectedEvent?.description || (
                      <span className="text-light-textMuted dark:text-dark-textMuted italic">
                        No description provided
                      </span>
                    )}
                  </p>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="bordered"
                  className="rounded-lg border-light-borderSecondary dark:border-dark-borderSecondary text-light-textPrimary dark:text-dark-textPrimary"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CalendarComponent;
