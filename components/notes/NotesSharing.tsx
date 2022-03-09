import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { MdCancel, MdDelete, MdShare } from "react-icons/md";
import { Profile } from "../../lib/constants";
import { elog } from "../../lib/mylog";
import { supabase } from "../../lib/supabaseClient";
import { useAuthContext } from "../../state/Authcontext";
import { definitions } from "../../types/supabase";

interface sharedProps {
  // postId: number;
  subheadingId: number;
}
export const NotesSharing: React.FC<sharedProps> = ({ subheadingId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputEmail, setInputEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [messageColor, setMessageColor] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [canCopy, setCanCopy] = React.useState(false);
  const [canEdit, setCanEdit] = React.useState(false);
  const { profile } = useAuthContext();

  const initialRef = useRef<HTMLInputElement | HTMLButtonElement | HTMLLabelElement>(null);
  const finalRef = useRef<HTMLInputElement | HTMLButtonElement | HTMLLabelElement>(null);
  const handleSharePost = async () => {
    setIsLoading(true);

    if (profile && inputEmail == profile.email) {
      setMessage("**You can not share your post to yourself ! ");
      setMessageColor("red");
      setIsLoading(false);
      return;
    }
    const { data: profiles, error } = await supabase.from<Profile>("profiles").select("id,email").eq("email", inputEmail);
    // .single();
    if (error) {
      setMessage("Something went wrong!");
      setMessageColor("red");
      setIsLoading(false);
      return;
    }
    if (profiles?.length == 0) {
      setMessage("This email is not valid");
      setMessageColor("red");
    } else {
      setMessage("");
      const { data: ispostexist, error: ispostexisterror } = await supabase
        .from<definitions["books_article_sharing"]>("books_article_sharing")
        .select(`*`)
        .match({ books_subheadings_fk: subheadingId, shared_with: profiles![0].id });

      if (ispostexist?.length != 0) {
        setMessage("This post is already shared with this user");
        setMessageColor("red");
      } else {
        const { data: sharedData, error } = await supabase
          .from<definitions["books_article_sharing"]>("books_article_sharing")
          .insert({
            books_subheadings_fk: subheadingId,
            shared_with: profiles![0].id,
            sharedwith_email: profiles![0].email,
            owned_by: profile!.id,
            shared_by: profile!.id,
            ownedby_email: profile!.email,
            allow_edit: canEdit,
            allow_copy: canCopy,
          });
        if (error) {
          elog("inserting shared data", error.message);
          setMessage(error.message);
          setMessageColor("red");
          setIsLoading(false);
          return;
        }

        if (sharedData) {
          setMessage("Shared successfully");
          setMessageColor("green");
          setIsLoading(false);
        }
      }
    }
    setIsLoading(false);
  };

  const handleChange = (e: any) => {
    setInputEmail(e.target.value);
    // console.log('handle change called')
  };

  return (
    <>
      <ButtonGroup mb="" justifyContent="end" size="sm" isAttached variant="outline">
        <IconButton
          colorScheme="whatsapp"
          variant="ghost"
          size={"xs"}
          icon={<MdShare />}
          onClick={onOpen}
          aria-label={""}
        ></IconButton>
      </ButtonGroup>

      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share your post</ModalHeader>
          {/* <div>
            {message}
          </div> */}
          <Text ml="4" color={messageColor}>
            {message}
            {message ? "..." : ""}
          </Text>

          <ModalCloseButton />

          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Email of your friend</FormLabel>
              <Input
                name="email"
                value={inputEmail}
                onChange={handleChange}
                ref={initialRef as React.RefObject<HTMLInputElement>}
                placeholder="First name"
              />
              {/* <FormErrorMessage>{error}</FormErrorMessage> */}
            </FormControl>

            <Checkbox
              colorScheme={"whatsapp"}
              textTransform={"capitalize"}
              ml="0"
              onChange={(e) => setCanCopy(e.target.checked)}
            >
              Can Edit
            </Checkbox>
            <Checkbox
              colorScheme={"whatsapp"}
              textTransform={"capitalize"}
              ml="6"
              onChange={(e) => setCanEdit(e.target.checked)}
            >
              Can copy
            </Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="whatsapp"
              leftIcon={<MdShare />}
              onClick={handleSharePost}
              size="sm"
              mr={3}
            >
              Share
            </Button>
            <Button colorScheme="whatsapp" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
          <SharedList subheadingId={subheadingId}></SharedList>
        </ModalContent>
      </Modal>
    </>
  );
};

export const SharedList: React.FC<{ subheadingId: number }> = ({ subheadingId }) => {
  const { profile } = useAuthContext();
  const [sharedlist, setSharedlist] = useState<definitions["books_article_sharing"][] | undefined>();

  useEffect(() => {
    const getSharedList = async () => {
      const { data, error } = await supabase
        .from<definitions["books_article_sharing"]>("books_article_sharing")
        .select(`*`)
        .match({ books_subheadings_fk: subheadingId, shared_by: profile?.id })
        .is("ispublic", null);

      if (data) {
        setSharedlist(data);
      }
    };
    getSharedList();
  }, []);

  const handleEditCheckbox = async (sharingId: number, checkValue: boolean) => {
    const { data, error } = await supabase
      .from<definitions["books_article_sharing"]>("books_article_sharing")
      .update({ allow_edit: checkValue })
      .match({ id: sharingId });
  };
  const handleCopyCheckbox = async (sharingId: number, checkValue: boolean) => {
    const { data, error } = await supabase
      .from<definitions["books_article_sharing"]>("books_article_sharing")
      .update({ allow_copy: checkValue })
      .match({ id: sharingId });
  };

  return (
    <>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Can Edit</Th>
            <Th>Can Copy</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        {sharedlist ? (
          <Tbody>
            {sharedlist.map((x) => {
              return (
                <Tr key={x.id}>
                  <Td>{x.sharedwith_email}</Td>
                  <Td>
                    {" "}
                    <Checkbox
                      colorScheme={"whatsapp"}
                      textTransform={"capitalize"}
                      ml="0"
                      defaultIsChecked={x.allow_edit}
                      onChange={(e) => handleEditCheckbox(x.id, e.target.checked)}
                    >
                      {/* Can Edit */}
                    </Checkbox>
                  </Td>
                  <Td>
                    {" "}
                    <Checkbox
                      colorScheme={"whatsapp"}
                      textTransform={"capitalize"}
                      ml="0"
                      defaultIsChecked={x.allow_copy}
                      onChange={(e) => handleCopyCheckbox(x.id, e.target.checked)}
                    >
                      {/* Can Edit */}
                    </Checkbox>
                  </Td>
                  <Td>
                    <IconButton variant="ghost" size="xs" colorScheme={"red"} icon={<MdCancel/>} aria-label={""}></IconButton>
                  </Td>
                </Tr>
              );
            })}
            
          </Tbody>
        ) : (
          <Spinner mx="50%" m="8"/>
        )}
      </Table>
    </>
  );
};

export default NotesSharing;
