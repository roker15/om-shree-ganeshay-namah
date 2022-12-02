import { Box, Button, Center, Container, Grid, GridItem, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useGetSyllbusModeratorbyStatus } from "../customHookes/apiHooks";
import { useGetUserRequest } from "../customHookes/networkHooks";
import { colorPrimary } from "../lib/constants";

const ManageRequest = () => {
  const [selectedMode, setSelectedMode] = useState<number | undefined>(undefined);
  const mode = ["DEACTIVATED", "ACTIVE", "REQUEST"];
  return (
    <Container maxW="5xl">
      <Center h="32">
        <Heading>Manage Moderators </Heading>
      </Center>
      <Stack direction="row" justifyContent="center">
        {mode.map((x, index) => (
          <Button
            onClick={() => {
              setSelectedMode(index);
            }}
            size="md"
            key={index}
            boxShadow="lg"
            colorScheme={selectedMode === index ? "orange" : "gray"}
          >
            {x}
          </Button>
        ))}
      </Stack>
      <br/>
      <br/>
      {selectedMode === 0 && <ModeratorRequest mode={false}  />}
      {selectedMode === 1 && <ModeratorRequest mode={true}  />}
      {selectedMode === 2 && <CollegeAndSyllabusRequest />}
    </Container>
  );
};
export default ManageRequest;

const CollegeAndSyllabusRequest = () => {
  const { userRequest, isLoading } = useGetUserRequest();

  return (
    <Box >
      {userRequest?.map((x) => (
        <Grid key={x.id} templateColumns="repeat(7, 1fr)" gap="16">
          <GridItem colSpan={3} h='10'>
            <Text casing="capitalize">{x.message}</Text>
          </GridItem>
          <GridItem colSpan={2} h='10'>
            <Text>{(x.user_fk as any).email}</Text>
          </GridItem>
          <GridItem colSpan={2} h='10'>
            <Text>{x.mobile}</Text>
          </GridItem>
        </Grid>
      ))}
    </Box>
  );
};

const ModeratorRequest = (props: { mode: boolean }) => {
  const { data, isLoading } = useGetSyllbusModeratorbyStatus(props.mode.toString())
  return (
    <Box >
      {props.mode.toString() }
      {data?.map((x) => (
        <Grid key={x.id} templateColumns="repeat(7, 1fr)" gap="16">
          <GridItem colSpan={3} h='10'>
            <Text casing="capitalize">{x.books.book_name}</Text>
          </GridItem>
          <GridItem colSpan={2} h='10'>
            <Text>{x.is_active}</Text>
          </GridItem>
          <GridItem colSpan={2} h='10'>
            <Text>{x.profiles?.email}</Text>
          </GridItem>
        </Grid>
      ))}
    </Box>
  );
}