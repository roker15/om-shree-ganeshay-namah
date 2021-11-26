import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/alert";
import { Center } from "@chakra-ui/layout";
import React from "react";

type ErrorAlertProps = {
    description: string;
    alertType:"error"|"info"|"warning"|"success"
};

export default function ErrorAlert({ description,alertType }: ErrorAlertProps) {
    if (alertType==="error") {
        return<Alert bg="blackAlpha.200" status="error">
        <Center>
          <AlertIcon color="blackAlpha.900" />
          <AlertDescription>{description}</AlertDescription>
        </Center>
      </Alert>;  
    }
    if (alertType==="info") {
        return<Alert bg="blackAlpha.200" status="info">
        <Center>
          <AlertIcon color="blackAlpha.900" />
          <AlertDescription>{description}</AlertDescription>
        </Center>
      </Alert>;  
    }
    if (alertType==="warning") {
        return<Alert bg="blackAlpha.200" status="warning">
        <Center>
          <AlertIcon color="blackAlpha.900" />
          <AlertDescription>{description}</AlertDescription>
        </Center>
      </Alert>;  
    }
    return <div></div>
  
}
