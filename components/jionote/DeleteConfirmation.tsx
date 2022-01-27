import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import React from "react";
import { MdDelete } from "react-icons/md";
import { QuestionBank } from "../../types/myTypes";

interface AlertdialogueProps {
  handleDelete: () => Promise<void>;
  //   x: QuestionBank;
  dialogueHeader: string;
  isDisabled: boolean;
}
function DeleteAlertDialogue({ handleDelete, dialogueHeader, isDisabled }: AlertdialogueProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  const confirmDelete = () => {
    handleDelete();
    onClose();
  };

  return (
    <>
      <Button
        colorScheme="red"
        isDisabled={isDisabled}
        leftIcon={<MdDelete />}
        variant="ghost"
        size="xs"
        onClick={() => setIsOpen(true)}
      >
        {dialogueHeader}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {dialogueHeader}
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can`t undo this action afterwards.</AlertDialogBody>

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
}
