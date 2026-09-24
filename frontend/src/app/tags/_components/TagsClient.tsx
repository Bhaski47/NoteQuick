"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Tag, User } from "@/types";
import { useTodoStore } from "@/store/useTodoStore";
import { useUserStore } from "@/store/useUserStore";
import { onCreateTag } from "@/actions/onCreateTag";
import { onDeleteTag } from "@/actions/onDeleteTag";
import { toast } from "@/utils/toast";
import { LuPlus, LuSearch, LuTag, LuTrash2 } from "react-icons/lu";
import { IoPricetagsOutline } from "react-icons/io5";

export default function TagsClient({
  initialTags,
  userDetails,
}: {
  initialTags: Tag[];
  userDetails?: User | null;
}) {
  const tags = useTodoStore((s) => s.tags);
  const setTags = useTodoStore((s) => s.setTags);
  const addTag = useTodoStore((s) => s.addTag);
  const removeTag = useTodoStore((s) => s.removeTag);

  const setEmail = useUserStore((s) => s.setEmail);
  const setUserName = useUserStore((s) => s.setUserName);

  const [newTagName, setNewTagName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Sync user details so sidebar NameBox always displays userName on page refresh
  useEffect(() => {
    if (userDetails && "username" in userDetails && userDetails.username) {
      setUserName(userDetails.username);
    }
    if (userDetails && "email" in userDetails && userDetails.email) {
      setEmail(userDetails.email);
    }
  }, [userDetails, setUserName, setEmail]);

  // Sync initialTags into store on mount or when initialTags change
  useEffect(() => {
    if (Array.isArray(initialTags)) {
      setTags(initialTags);
    }
  }, [initialTags, setTags]);

  const filteredTags = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((t) => t.name.toLowerCase().includes(q));
  }, [tags, searchQuery]);

  const handleCreateTag = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const normalized = newTagName.trim().toLowerCase();

    if (!normalized) {
      toast.warning("Tag Name Required", "Please enter a tag name");
      return;
    }

    if (normalized.length > 30) {
      toast.warning("Tag Too Long", "Tag name must be 30 characters or less");
      return;
    }

    const validPattern = /^[a-zA-Z0-9_\-\s]+$/;
    if (!validPattern.test(normalized)) {
      toast.warning(
        "Invalid Characters",
        "Tags may only contain letters, numbers, spaces, hyphens, and underscores"
      );
      return;
    }

    const existingTag = tags.find(
      (t) => t.name.trim().toLowerCase() === normalized
    );
    if (existingTag) {
      toast.warning("Tag Already Exists", `Tag #${normalized} already exists`);
      return;
    }

    try {
      setIsCreating(true);
      const res = await onCreateTag(normalized);
      if (res.success && res.data) {
        addTag(res.data);
        setNewTagName("");
        toast.success(
          "Tag Created",
          `Tag #${res.data.name} was created successfully`
        );
      } else {
        toast.error("Failed to Create Tag", res.message || "Unknown error");
      }
    } catch (err: unknown) {
      toast.error(
        "Error",
        err instanceof Error ? err.message : "Failed to create tag"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenDelete = (tag: Tag) => {
    setTagToDelete(tag);
    onOpen();
  };

  const handleConfirmDelete = async () => {
    if (!tagToDelete) return;
    try {
      setIsDeleting(true);
      const res = await onDeleteTag(tagToDelete.tagId);
      if (res.success) {
        removeTag(tagToDelete.tagId, tagToDelete.name);
        toast.success(
          "Tag Deleted",
          `Tag #${tagToDelete.name} was removed from all tasks`
        );
        onClose();
        setTagToDelete(null);
      } else {
        toast.error("Failed to Delete Tag", res.message || "Unknown error");
      }
    } catch (err: unknown) {
      toast.error(
        "Error",
        err instanceof Error ? err.message : "Failed to delete tag"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full min-h-dvh flex-1 px-4 sm:px-10 py-6 bg-light-backgroundColor dark:bg-dark-backgroundColor">
      <div className="max-w-4xl w-full">
        {/* Page Title */}
        <div className="pt-4 pb-4">
          <h1 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary tracking-tight">
            TAGS
          </h1>
          <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
            Organize and manage tags. Deleting a tag automatically removes it from
            all associated tasks.
          </p>
        </div>

        {/* Create Tag Card */}
        <div className="bg-white dark:bg-[#202127] border border-borderDivider rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-3 flex items-center gap-2">
            <LuTag className="text-light-buttonPrimary dark:text-dark-buttonPrimary" />
            Create New Tag
          </h2>
          <form
            onSubmit={handleCreateTag}
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
          >
            <Input
              type="text"
              placeholder="e.g. work, urgent, personal..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              startContent={
                <span className="text-zinc-400 font-bold text-sm">#</span>
              }
              variant="bordered"
              size="md"
              className="flex-1"
              classNames={{
                inputWrapper:
                  "border-gray-200 dark:border-zinc-700 hover:border-light-buttonPrimary dark:hover:border-dark-buttonPrimary focus-within:!border-light-buttonPrimary dark:focus-within:!border-dark-buttonPrimary",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateTag();
                }
              }}
            />
            <Button
              type="submit"
              isLoading={isCreating}
              className="bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white font-medium px-5 h-10 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
              startContent={!isCreating && <LuPlus size={18} />}
            >
              Add Tag
            </Button>
          </form>
        </div>

        {/* Search Bar & Tag Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <Input
            isClearable
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onClear={() => setSearchQuery("")}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={
              <LuSearch className="text-zinc-400 dark:text-zinc-500" size={16} />
            }
            variant="bordered"
            size="sm"
            className="w-full sm:max-w-xs"
            classNames={{
              inputWrapper:
                "border-gray-200 dark:border-zinc-700 hover:border-light-buttonPrimary dark:hover:border-dark-buttonPrimary",
            }}
          />
          <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-medium">
            {tags.length} {tags.length === 1 ? "tag" : "tags"} total
            {searchQuery.trim() && ` (${filteredTags.length} matched)`}
          </span>
        </div>

        {/* Tags List Container */}
        <div className="bg-white dark:bg-[#202127] border border-borderDivider rounded-xl p-4 sm:p-5 shadow-sm min-h-[220px]">
          {tags.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-light-buttonPrimary/10 dark:bg-dark-buttonPrimary/20 flex items-center justify-center mb-3">
                <IoPricetagsOutline
                  size={24}
                  className="text-light-buttonPrimary dark:text-dark-buttonPrimary"
                />
              </div>
              <h3 className="text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                No tags created yet
              </h3>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1 max-w-xs">
                Create tags above to categorize and filter your tasks easily.
              </p>
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LuSearch className="text-zinc-400 mb-2" size={24} />
              <h3 className="text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                No tags found
              </h3>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
                No tags match &quot;{searchQuery}&quot;. Try a different search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredTags.map((tag) => {
                const count = tag.todoCount ?? 0;
                return (
                  <div
                    key={tag.tagId}
                    className="flex items-center justify-between p-3 rounded-lg border border-borderDivider bg-white/60 dark:bg-zinc-800/40 hover:border-light-buttonPrimary/40 dark:hover:border-dark-buttonPrimary/40 hover:bg-light-buttonPrimary/5 dark:hover:bg-dark-buttonPrimary/10 transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="font-semibold text-sm text-light-buttonPrimary dark:text-dark-buttonPrimary truncate">
                        #{tag.name}
                      </span>
                      <Chip
                        size="sm"
                        variant="flat"
                        className="text-[11px] h-5 px-1.5 font-medium bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none shrink-0"
                      >
                        {count} {count === 1 ? "task" : "tasks"}
                      </Chip>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenDelete(tag)}
                      className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors shrink-0"
                      title={`Delete tag #${tag.name}`}
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="sm" backdrop="blur">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-light-textPrimary dark:text-dark-textPrimary">
                Delete Tag
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-light-textPrimary dark:text-dark-textPrimary">
                    #{tagToDelete?.name}
                  </span>
                  ?
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 mt-2">
                  This tag will be permanently deleted and stripped from all{" "}
                  <span className="font-semibold">
                    {tagToDelete?.todoCount ?? 0}{" "}
                    {(tagToDelete?.todoCount ?? 0) === 1 ? "task" : "tasks"}
                  </span>
                  . This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  size="sm"
                  onPress={onClose}
                  isDisabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  isLoading={isDeleting}
                  onPress={handleConfirmDelete}
                >
                  Delete Tag
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
