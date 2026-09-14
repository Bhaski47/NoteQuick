"use client";
import { useTodoStore } from "@/store/useTodoStore";
import { useUserStore } from "@/store/useUserStore";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import axios from "axios";
import NProgress from "nprogress";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdOutlineLogout } from "react-icons/md";
 
export default function LogOutButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = useUserStore((s) => s.name);
  const userName = useUserStore((s) => s.userName);
  const email = useUserStore((s) => s.email);
  const clearUserData = useUserStore((s) => s.clearUserData);
  const clearTodoData = useTodoStore((s) => s.resetTodo);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      onClose();
      NProgress.start();

      await axios.get("/api/logout").catch((err) => {
        console.warn("Logout endpoint warning:", err);
      });

      clearUserData();
      clearTodoData();

      // Brief delay so the user perceives the smooth signing-out transition
      await new Promise((resolve) => setTimeout(resolve, 500));

      window.location.replace("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      NProgress.done();
    }
  };

  const displayName = name || userName || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <Button
        color="danger"
        className="w-full my-3 py-5 text-lg rounded-lg flex self-start justify-start"
        startContent={<MdOutlineLogout size={28} />}
        variant="bordered"
        onPress={onOpen}
      >
        <p className="text-textPrimary font-bold">Log Out</p>
      </Button>

      <Modal
        isOpen={isOpen}
        size="sm"
        backdrop="blur"
        isDismissable={!isLoggingOut}
        hideCloseButton={isLoggingOut}
        onClose={!isLoggingOut ? onClose : undefined}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.15,
                ease: "easeOut",
              },
            },
            exit: {
              y: -8,
              opacity: 0,
              scale: 0.96,
              transition: {
                duration: 0.1,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-3 pt-6 px-6">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <MdOutlineLogout size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-light-textPrimary dark:text-dark-textPrimary">
                    Log Out of NoteQuick
                  </h3>
                  <p className="text-xs font-normal text-light-textSecondary dark:text-dark-textSecondary">
                    Confirm your sign-out
                  </p>
                </div>
              </ModalHeader>

              <ModalBody className="py-3 px-6">
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Are you sure you want to end your current session?
                </p>

                {(email || userName || name) && (
                  <div className="flex items-center gap-3 p-2.5 mt-2 rounded-xl bg-light-backgroundColor dark:bg-dark-background border border-light-borderPrimary dark:border-dark-borderPrimary">
                    <div className="w-9 h-9 rounded-full bg-light-buttonPrimary/15 dark:bg-dark-buttonPrimary/25 text-light-buttonPrimary dark:text-dark-buttonPrimary font-bold text-sm flex items-center justify-center shrink-0">
                      {initial}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary truncate">
                        {displayName}
                      </span>
                      {email && (
                        <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary truncate">
                          {email}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="pb-6 px-6 pt-3 flex gap-2">
                <Button
                  variant="light"
                  color="default"
                  className="font-semibold text-sm flex-1"
                  isDisabled={isLoggingOut}
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  className="font-semibold text-sm flex-1 shadow-md shadow-red-500/20"
                  isLoading={isLoggingOut}
                  isDisabled={isLoggingOut}
                  startContent={!isLoggingOut ? <MdOutlineLogout size={16} /> : null}
                  onPress={handleLogout}
                >
                  {isLoggingOut ? "Logging out..." : "Log Out"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Professional Full-Screen Sign-Out Transition Overlay */}
      {mounted &&
        isLoggingOut &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-md transition-opacity duration-200">
            <div className="flex flex-col items-center gap-5 p-8 rounded-3xl bg-light-backgroundColor dark:bg-dark-backgroundColor border border-light-borderPrimary dark:border-dark-borderPrimary shadow-2xl max-w-sm w-[90%] text-center">
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-3 border-red-500/20 border-t-red-500 animate-spin" />
                <div className="absolute w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <MdOutlineLogout size={18} />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">
                  Signing Out...
                </h3>
                <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                  Safely closing your session. See you soon!
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
