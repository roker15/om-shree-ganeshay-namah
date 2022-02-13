import {
  Button, Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, useDisclosure
} from "@chakra-ui/react";
import React from "react";
import { MyDropzone } from "./MyDropzone";

export const UiForImageUpload = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button size="sm" variant="outline" color="gray.600" mt={3} onClick={onOpen}>
        Upload Image
      </Button>
      <Modal onClose={onClose} size={"2xl"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md" color="blue.600">Upload Images & Copy link to Insert Image in your Notes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MyDropzone />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
