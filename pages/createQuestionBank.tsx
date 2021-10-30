import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Container, VStack } from "@chakra-ui/layout";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import Editor from "../components/Suneditor";
interface IFormInput {
  firstName: string;
  lastName: string;
  age: number;
  content: string;
}

const CreateQuestionBank: React.FC = ({ ...props }) => {
  const { register, handleSubmit, control } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log("data submitted",data)
    // alert(JSON.stringify(data));
  };
  const description = "<p>Default value</p>";
  return (
    <Container>
      <VStack p="2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input p="4" {...register("firstName", { required: true, maxLength: 20 })} />
          <Input p="2" {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
          <Input p="2" type="number" {...register("age", { min: 18, max: 99 })} />
          <Editor name="description"  control={control} placeholder="Write a Description..." />

          <Button type="submit">Submit</Button>
        </form>
      </VStack>
    </Container>
  );
};
export default CreateQuestionBank;
