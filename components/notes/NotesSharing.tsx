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
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useRef, useState } from "react";
import { MdCancel, MdDelete, MdShare } from "react-icons/md";
import { Profile } from "../../lib/constants";
import { Database } from "../../lib/database";
import { elog } from "../../lib/mylog";
import { useAuthContext } from "../../state/Authcontext";
import { definitions } from "../../types/supabase";

interface sharedProps {
  // postId: number;
  subheadingId: number;
}
export const NotesSharing: React.FC<sharedProps> = ({ subheadingId }) => {
  const supabaseClient = useSupabaseClient<Database>();
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
    const { data: profiles, error } = await supabaseClient.from("profiles").select(`*`).eq("email", inputEmail);
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
      const { data: ispostexist, error: ispostexisterror } = await supabaseClient
        .from("books_article_sharing")
        .select(`*`)
        .match({ books_subheadings_fk: subheadingId, shared_with: profiles![0].id, owned_by: profile?.id });

      if (ispostexist?.length != 0) {
        setMessage("This post is already shared with this user");
        setMessageColor("red");
      } else {
        const { data: sharedData, error } = await supabaseClient.from("books_article_sharing").insert({
          books_subheadings_fk: subheadingId,
          shared_with: profiles![0].id,
          sharedwith_email: profiles![0].email,
          sharedwith_name: profiles![0].username,
          sharedwith_avatar: profiles![0].avatar_url,
          owned_by: profile!.id,
          ownedby_email: profile!.email,
          ownedby_name: profile?.username,
          ownedby_avatar: profile?.avatar_url,
          shared_by: profile!.id,
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
      {/* <ButtonGroup mb="" justifyContent="end" size="sm" isAttached variant="outline"> */}
      <Button
        // colorScheme="whatsapp"
        variant="unstyled"
        size={"xs"}
        leftIcon={<MdShare />}
        onClick={onOpen}
        aria-label={"d"}
        // ml="-1"
      >
        Share Notes{" "}
      </Button>
      {/* </ButtonGroup> */}

      <Modal size="xl" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this Topic</ModalHeader>
          {/* <div>
            {message}
          </div> */}
          <Text casing="capitalize" as="label" ml="4" color={messageColor}>
            {message}
            {message ? "..." : ""}
          </Text>

          <ModalCloseButton />

          <ModalBody pb={6}>
            <FormControl>
              {/* <FormLabel as="text">Email of Jionote User</FormLabel> */}
              <Input
                size="sm"
                py="4"
                name="email"
                value={inputEmail}
                onChange={handleChange}
                ref={initialRef as React.RefObject<HTMLInputElement>}
                placeholder="Email of Jionote User"
              />
              {/* <FormErrorMessage>{error}</FormErrorMessage> */}
            </FormControl>

            <Checkbox size="sm" textTransform={"capitalize"} onChange={(e) => setCanEdit(e.target.checked)}>
              <Text as="label" casing="capitalize">
                User Can edit
              </Text>
            </Checkbox>
            <Checkbox
              size="sm"
              colorScheme={"whatsapp"}
              textTransform={"capitalize"}
              ml="6"
              onChange={(e) => setCanCopy(e.target.checked)}
            >
              <Text as="label" casing="capitalize">
                User Can copy
              </Text>
            </Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button isLoading={isLoading} leftIcon={<MdShare />} onClick={handleSharePost} mr={3}>
              Share
            </Button>
            <Button colorScheme="whatsapp" variant="outline" size="xs" onClick={onClose}>
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
  const supabaseClient = useSupabaseClient<Database>();
  const { profile } = useAuthContext();
  const [sharedlist, setSharedlist] = useState<Database["public"]["Tables"]["books_article_sharing"]["Row"][] | undefined>();

  useEffect(() => {
    const getSharedList = async () => {
      const { data, error } = await supabaseClient
        .from("books_article_sharing")
        .select(`*`)
        .match({ books_subheadings_fk: subheadingId, shared_by: profile?.id, ispublic: false });
      // .is("ispublic", null);

      if (data) {
        setSharedlist(data);
      }
    };
    getSharedList();
  }, [profile?.id, subheadingId]);

  const handleEditCheckbox = async (sharingId: number, checkValue: boolean) => {
    const { data, error } = await supabaseClient
      .from("books_article_sharing")
      .update({ allow_edit: checkValue })
      .match({ id: sharingId });
  };
  const handleCopyCheckbox = async (sharingId: number, checkValue: boolean) => {
    const { data, error } = await supabaseClient
      .from("books_article_sharing")
      .update({ allow_copy: checkValue })
      .match({ id: sharingId });
  };
  const handleCancelSharing = async (sharingId: number) => {
    const { data, error } = await supabaseClient.from("books_article_sharing").delete().match({ id: sharingId });
    if (error) {
      elog("Notesharing-->handlecancelsharing", error.message);
      return;
    }
    if (data) {
      sharedlist!.splice(
        sharedlist!.findIndex((item) => item.id === sharingId),
        1
      );
      setSharedlist([...sharedlist!]);
    }
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
                      textTransform={"capitalize"}
                      defaultChecked={x.allow_edit!}
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
                      defaultChecked={x.allow_copy!}
                      onChange={(e) => handleCopyCheckbox(x.id, e.target.checked)}
                    >
                      {/* Can Edit */}
                    </Checkbox>
                  </Td>
                  <Td>
                    <IconButton icon={<MdCancel />} aria-label={""} onClick={() => handleCancelSharing(x.id)}></IconButton>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        ) : (
          <Spinner mx="50%" m="8" />
        )}
      </Table>
    </>
  );
};

export default NotesSharing;
