import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle
} from "@chakra-ui/react";

export const CustomAlert = (props: { title: string; des: string; }) => {
  return (
    <Alert
      status="info"
      variant="left-accent"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {props.title}
      </AlertTitle>
      <AlertDescription maxWidth="sm">{props.des}</AlertDescription>
    </Alert>
  );
};
