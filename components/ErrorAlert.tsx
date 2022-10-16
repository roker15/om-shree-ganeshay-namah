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
          <AlertIcon  />
          <AlertDescription>{description}</AlertDescription>
        </Center>
      </Alert>;  
    }
    if (alertType==="info") {
        return<Alert  status="info">
        <Center>
          <AlertIcon  />
          <AlertDescription>{description}</AlertDescription>
        </Center>
      </Alert>;  
    }
    if (alertType==="warning") {
        return<Alert  status="warning">
        <Center>
          <AlertIcon  />
          <AlertDescription>{description}</AlertDescription>
        </Center>
      </Alert>;  
    }
    return <div></div>
  
}
