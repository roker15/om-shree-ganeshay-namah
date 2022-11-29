import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  MenuItem,
} from "@chakra-ui/react";
import React from "react";
import { MdDelete, MdDeleteOutline } from "react-icons/md";

interface AlertdialogueProps {
  handleDelete: () => Promise<void>;
  dialogueHeader: string;
  buttonType?: "MENU" | "BUTTON" | undefined;
  // id should not be required, rethink how it can be done
  // id: number;
}

export const DeleteAlert = ({ handleDelete, dialogueHeader, buttonType }: AlertdialogueProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  const confirmDelete = () => {
    handleDelete();
    onClose();
  };

  return (
    <>
      {!buttonType && (
        <IconButton size="xs" variant="ghost" aria-label="Call Sage" onClick={() => setIsOpen(true)} icon={<MdDelete />} />
      )}
      {buttonType === "MENU" && (
        <MenuItem onClick={() => setIsOpen(true)} icon={<MdDeleteOutline />}>
          Delete Article
        </MenuItem>
      )}

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader p="2" bg="gray.100">
              {dialogueHeader}
            </AlertDialogHeader>

            <AlertDialogBody py="8">Are you sure? You can`t undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" size="sm" onClick={() => confirmDelete()} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
