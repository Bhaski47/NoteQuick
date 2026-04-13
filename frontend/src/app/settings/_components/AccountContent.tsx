import { TabNavigateProps } from "@/types";
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
import { redirect } from "next/navigation";
import React from "react";

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
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
          <ModalContent>
            {(onClose) => (
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
                    onPress={onClose}
                    style={{ fontWeight: "bolder" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    onPress={async () => {
                      const token = document.cookie
                        .split("; ")
                        .find((row) => row.startsWith("token="))
                        ?.split("=")[1];

                      await axios.delete(
                        `${process.env.host}/user/deleteUser`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );

                      redirect("/auth");
                      onClose();
                    }}
                    style={{ fontWeight: "bolder" }}
                  >
                    Confirm Delete
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
