import { TabNavigateProps } from "@/types";
import { useTodoStore } from "@/store/useTodoStore";
import { useUserStore } from "@/store/useUserStore";
import Divider from "@/utils/Divider";
import InputButton from "@/utils/InputButton";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "@/utils/toast";

interface UserIconProps {
  fill?: string;
  size?: number;
  height?: number;
  width?: number;
}

const UserIcon: React.FC<UserIconProps> = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      data-name="Iconly/Curved/Profile"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      >
        <path
          d="M11.845 21.662C8.153 21.662 5 21.088 5 18.787s3.133-4.425 6.845-4.425c3.692 0 6.845 2.1 6.845 4.4s-3.134 2.9-6.845 2.9z"
          data-name="Stroke 1"
        />
        <path
          d="M11.837 11.174a4.372 4.372 0 10-.031 0z"
          data-name="Stroke 3"
        />
      </g>
    </svg>
  );
};

export default function AccountContent({ userDetails }: TabNavigateProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const clearUserData = useUserStore((s) => s.clearUserData);
  const clearTodoData = useTodoStore((s) => s.resetTodo);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const apiHost = process.env.host || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      await axios.delete(
        `${apiHost}/user/deleteUser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await axios.get("/api/logout").catch(() => {});
      clearUserData();
      clearTodoData();

      toast.info("Account Deleted", "Your account and data have been removed");
      onClose();
      router.replace("/auth");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed", "Could not delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="flex flex-col w-full sm:w-full overflow-hidden">
      <div className="w-2/3 py-8 px-4 sm:px-8">
        <header className="text-lg font-bold">Account Details</header>
        <p className="font-bold text-textSecondary">
          Control your account settings and preferences
        </p>
        <div className="flex flex-col sm:flex-row gap-x-24 gap-y-12 mt-5 sm:pt-0">
          <InputButton placeholder="Email" value={userDetails.email} disabled />
        </div>
        <Button
          color="danger"
          className="w-fit mt-3"
          startContent={<UserIcon />}
          variant="bordered"
          onPress={onOpen}
        >
          Delete Account
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={!isDeleting ? onClose : undefined}
          isDismissable={!isDeleting}
          hideCloseButton={isDeleting}
          backdrop="blur"
        >
          <ModalContent>
            {(handleClose) => (
              <>
                <ModalHeader className="text-danger">
                  Delete Account
                </ModalHeader>
                <ModalBody>
                  <p className="font-semibold">
                    Are you sure you want to delete your account?
                  </p>
                  <p className="text-sm text-gray-500 font-semibold">
                    This action cannot be undone!!
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="light"
                    isDisabled={isDeleting}
                    onPress={handleClose}
                    style={{ fontWeight: "bolder" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    isLoading={isDeleting}
                    isDisabled={isDeleting}
                    onPress={handleDeleteAccount}
                    style={{ fontWeight: "bolder" }}
                  >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <Divider />
    </main>
  );
}
