import { AddIcon } from "@chakra-ui/icons";
import {
  Text,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";
import { Database } from "../lib/database";
import { useAuthContext } from "../state/Authcontext";
import { customToast } from "../componentv2/CustomToast";

const RequestDrawer = (props: { buttonType: "xs" | "md" | "icon" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabaseClient = useSupabaseClient<Database>();
  const { profile } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  interface Formdata {
    message: string;
    mobile: string | undefined;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Formdata>();
  //form submit method
  const onSubmit: SubmitHandler<Formdata> = async (data) => {
    console.log("hit");
    setIsLoading(true);
    const { error } = await supabaseClient
      .from("request")
      .insert({ message: data.message, mobile: data.mobile, user_fk: profile?.id });
    if (error) {
      alert(error.message);
      return;
    }
    setIsLoading(false);
    customToast({ title: "Request Sent, We will get back to you!", status: "success" });
  };

  return (
    <>
      <ButtonSmall onClick={onOpen} />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Request us Anything</DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="24px">
                <Box>
                  <Box>
                    <FormLabel color="blue.600">TELL US WHAT YOU WANT</FormLabel>
                    <Textarea
                      {...register("message", {
                        required: "This is required",
                        maxLength: { value: 150, message: "Maximum 150 Characters allowed" },
                        minLength: { value: 5, message: "minimum 5 Characters required" },
                      })}
                      placeholder="College/Course/Syllabus/Exams/Features"
                    />
                    <Text as="label" color="red.600">
                      {errors.message && errors.message.message}
                    </Text>
                  </Box>
                </Box>

                <Box>
                  <FormLabel color="blue.600">MOBILE</FormLabel>

                  <Input
                    {...register("mobile", { required: true, maxLength: 10, minLength: 10 })}
                    placeholder="Mobile (It will help us to connect you quickly)"
                    type="number"
                  />

                  <Text as="label" color="red.600">
                    {" "}
                    {errors.mobile && "10 Digit mobile number requried."}
                  </Text>
                </Box>
              </Stack>
              <br />
              <Button isLoading={isLoading} size="md" colorScheme="blue" type="submit">
                Submit
              </Button>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
const ButtonSmall = (props: { onClick: () => void }) => {
  return (
    <Button size="xs" colorScheme="red" onClick={() => props.onClick()}>
      Ask Anything
    </Button>
  );
};
export default RequestDrawer;
