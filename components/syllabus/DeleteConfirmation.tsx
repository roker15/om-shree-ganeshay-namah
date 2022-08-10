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

const DeleteAlertDialogue = ({ handleDelete, dialogueHeader, isDisabled, isIconButton, id }: AlertdialogueProps) => {
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
          // _hover={{ color: "pink", fontSize: "22px" }}
          size="md"
          ml="2"
          borderRadius={"full"}
          variant="ghost"
          // colorScheme="red"
          // color="red.200"
          aria-label="Call Sage"
          // fontSize="20px"
          onClick={() => setIsOpen(true)}
          icon={<MdDelete />}
        />
      ) : (
        <Button
          // _hover={{ color: "pink", fontSize: "22px" }}
          size="sm"
          ml="-4"
          // borderRadius={"full"}
          variant="ghost"
          // colorScheme="red"
          // color="red.200"
          aria-label="Call Sage"
          // fontSize="20px"
          leftIcon={<MdDelete />}
          onClick={() => setIsOpen(true)}
          // icon={<MdDelete />}
        >
          Delete
        </Button>
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
export default DeleteAlertDialogue;
