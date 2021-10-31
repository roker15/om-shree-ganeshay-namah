import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Container } from "@chakra-ui/layout";
import dynamic from "next/dynamic";
import React from "react";
import { Badge, Center, Text } from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
// import Suneditor from "../components/Suneditor";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface IFormInput {
  firstName: string;
  lastName: string;
  age: number;
  description: string;
}

export default function App() {
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    alert(JSON.stringify(data));
  };
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const description = "<p>Default value</p>";

  return (
    <Container width="container.lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <br />
        <Center>
          <Badge colorScheme="purple" fontSize="2xl">
            Create Questions
          </Badge>
        </Center>
        <br />
        <br />
        <Badge colorScheme="green">First Name</Badge>
        <Input m="2" {...register("firstName", { required: true, maxLength: 20 })} />
        {errors?.firstName?.type === "required" && <p>This field is required</p>}
        <Badge colorScheme="green">Second Name</Badge>
        <Input m="2" {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
        <Input m="2" type="number" {...register("age", { min: 1, max: 99 })} />
        <Badge colorScheme="green">Question content</Badge>
        <Controller
          name="description"
          control={control}
          // defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <Box m="2">
              <SunEditor
                name={field.name}
                setOptions={{
                  mode: "balloon",
                  //   katex: katex,
                  height: "100%",

                  //   buttonList: buttonList,
                }}
                placeholder="put ur content"
                setContents={field.value}
                onChange={field.onChange}
              />
            </Box>
          )}
        />
        {errors?.description?.type === "required" && (
          <Text bg="blackAlpha.300" fontSize="16px" color="#bf1650">
            Im using a custom font-size value for this text
          </Text>
        )}
        {/* <Editor name="description" defaultValue={description} control={control} placeholder="Write a Description..." /> */}
        <Button mb="6" type="submit">
          submit
        </Button>
      </form>
    </Container>
  );
}
