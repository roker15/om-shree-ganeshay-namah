import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { MdDelete } from "react-icons/md";
import { QuestionBank } from "../../types/myTypes";

interface AlertdialogueProps {
  handleDelete: (id: number) => Promise<void>;
  //   x: QuestionBank;
  dialogueHeader: string;
  isDisabled: boolean;
  isIconButton: boolean;
  id: number;
}

const DeleteAlertDialogue = ({ handleDelete, dialogueHeader, isDisabled, isIconButton,id }: AlertdialogueProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  const confirmDelete = () => {
    handleDelete!(id);
    onClose();
  };

  return (
    <>
      {isIconButton ? (
        <IconButton
          _hover={{ color: "pink", fontSize: "22px" }}
          size="xs"
          ml="2"
          borderRadius={"full"}
          variant="outline"
          colorScheme="pink"
          aria-label="Call Sage"
          fontSize="20px"
          onClick={() => setIsOpen(true)}
          icon={<MdDelete />}
        />
      ) : (
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
      )}

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {dialogueHeader}
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can`t undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="pink" ref={cancelRef} size="sm" onClick={onClose}>
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
export default DeleteAlertDialogue;
