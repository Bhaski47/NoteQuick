"use client";
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
import { redirect } from "next/navigation";
import { MdOutlineLogout } from "react-icons/md";

export default function LogOutButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpen = () => {
    onOpen();
  };
  const email = useUserStore((s) => s.email);
  const clearUserData = useUserStore((s) => s.clearUserData);
  return (
    <>
      <Button
        color="danger"
        className="w-full my-3 py-5 text-lg rounded-lg flex self-start justify-start"
        startContent={<MdOutlineLogout size={28} />}
        variant="bordered"
        onPress={() => handleOpen()}
      >
        <p className="text-textPrimary font-bold">Log Out</p>
      </Button>
      <Modal
        isOpen={isOpen}
        size={"xs"}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to log out?
              </ModalHeader>
              <ModalBody className="font-medium">
                <p>Log out of Notequick as {email}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" className="font-semibold" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" className="font-semibold" onPress={()=>{
                  clearUserData();
                  redirect('/auth')
                }}>
                  Log Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
