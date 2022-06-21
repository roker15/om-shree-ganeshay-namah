import { Box, Button, Center, CircularProgress, Container, ListItem, OrderedList, Text } from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import copy from "copy-to-clipboard";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuid } from "uuid";
import { customToast } from "./CustomToast";

export function MyDropzone() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filelist, setFilelist] = useState<{ file: string; link: string }[]>([]);
  const mountedRef = useRef(false);

  // effect just for tracking mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const handleCopyLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string) => {
    e.stopPropagation;
    copy(value);
    customToast({ title: "Link copied", status: "info" });
  };
  // eslint-disable-next-line react/jsx-key
  const listItems = (
    <OrderedList color="green.500" fontSize="xs" fontWeight="bold" mx="8">
      {filelist.map((d) => (
        <ListItem key={d.link}>
          <Text fontSize="xs" maxW="2xl">
            File{" "}
            <Text as="span" color="gray.600">
              {d.file}
            </Text>{" "}
            uploaded sucessfully,{" "}
          </Text>
          <Button size="xs" colorScheme="telegram" variant="solid" onClick={(e) => handleCopyLink(e, d.link)}>
            Copy link
          </Button>
        </ListItem>
      ))}
    </OrderedList>
  );
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("accepted files are", acceptedFiles);
    setFilelist([]);
    setIsLoading(true);
    if (acceptedFiles.length == 0) {
      setIsLoading(false);
      return;
    }
    acceptedFiles.forEach(async (file: File) => {
      const filepath = uuid() + "-" + file.name;
      const { data, error } = await supabaseClient.storage.from("notes-images").upload(filepath, file, {
        cacheControl: "3600",
        upsert: true,
      });
      if (data) {
        console.log("data is ", data.Key);
        const { publicURL, error } = supabaseClient.storage.from("notes-images").getPublicUrl(filepath);
        console.log("public url is  ", publicURL);
        if (publicURL && mountedRef.current == true) {
          setFilelist((oldArray) => [...oldArray, { file: file.name, link: publicURL }]);
        }
      }
      if (mountedRef.current == true) {
        setIsLoading(false);
      }
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 2,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxSize: 2000000,
  });

  return (
    <Container w={{ base: "auto", md: "auto" }}>
      <Box {...getRootProps()}>
        <Center p="2" bg="blackAlpha.100" h="100px" color="blackAlpha.600">
          {/* <Spinner display={isLoading ? "block" : "none"}></Spinner> */}
          <CircularProgress display={isLoading ? "block" : "none"} isIndeterminate color="blue.300" />
          <input {...getInputProps()} />
          <Text fontSize="md">
            Click to select files or Drag and drop some files here..{" "}
            <Text color="gray.600">(Maximum files : 2, Maximum size : 2 mb)</Text>
          </Text>
        </Center>
      </Box>
      {listItems}
    </Container>
  );
}
