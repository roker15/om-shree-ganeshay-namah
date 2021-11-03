import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Container } from "@chakra-ui/layout";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Badge, Center, FormControl, FormErrorMessage, FormLabel, Select, Text } from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { supabase } from "../lib/supabaseClient";
import { Headings, QuestionBank } from "../types/myTypes";
import { useGetExamPapers, useGetQuestionsByPaperidAndYear } from "../customHookes/useUser";
import { MdMode } from "react-icons/md";
// import Suneditor from "../components/Suneditor";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface IFormInput {
  // id: number,
  //   created_at: string,
  //   updated_at: string,
  paperId: number;
  questionContent?: string;
  searchKeys?: string;
  year?: number;
  sequence?: number;
}

export default function App() {
  const [paperId, setPaperId] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [shouldfetch, setShouldfetch] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(1000);
  const { examPapers, isLoading, isError } = useGetExamPapers();
  const {
    questions,
    isLoading: isLoadingQuestions,
    isError: isErrorQuestions,
  } = useGetQuestionsByPaperidAndYear(paperId, year, shouldfetch);

  const onSubmit: SubmitHandler<IFormInput> = async (values) => {
    const { data, error } = await supabase.from<QuestionBank>("questionbank").insert({
      // id: number,
      // created_at: string,
      // updated_at: string,
      paper_id: values.paperId,
      question_content: values.questionContent,
      search_keys: values.searchKeys,
      year: values.year,
      sequence: values.sequence,
    });
    // isSubmitting == false;
    console.log(data);

    alert(JSON.stringify(data));
  };
  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  // const watchFields = watch((data, { name, type }) => console.log(data, name, type));
  // watchFields.get("question")
  const description = "<p>Default value</p>";

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value.year && value.year < 2021 && value.year > 1994) {
        setPaperId(value.paperId);
        setYear(value.year);
        setShouldfetch(true);
      }
      console.log("watching value", value, name, type);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleQuestionEdit = (e: QuestionBank) => {
    setIsEditMode(!isEditMode);
    setCurrentEditId(e.id);

    console.log("editing", e.id, e.question_content);
  };
  useEffect(() => {
    if (isEditMode ) {
      
    }
  });

  return (
    <Box mx={{ base: "4", md: "28", lg: "52" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <br />
        <Center>
          <Badge colorScheme="purple" fontSize="2xl">
            Create Questions
          </Badge>
        </Center>
        <br />
        <br />

        <FormControl m="2">
          <FormLabel color="blue.600" htmlFor="paperId">
            Exam paper
          </FormLabel>
          {errors?.paperId?.type === "required" && (
            <Text fontSize="16px" color="#bf1650">
              **This field is required
            </Text>
          )}
          <Select
            id="paperId"
            // w="48"
            placeholder="Select Exam Paper"
            {...register("paperId", {
              required: "This is required",
              // minLength: { value: 4, message: "Minimum length should be 4"  },
            })}
            // onChange={handleChange}
          >
            {examPapers?.map((x) => {
              return (
                <option key={x.id} value={x.id}>
                  {x.paper_name}
                </option>
              );
            })}
          </Select>
          {/* <FormErrorMessage>{errors.paperId && errors.paperId.message}</FormErrorMessage> */}
        </FormControl>

        <FormControl m="2">
          <FormLabel color="blue.600" htmlFor="paperId">
            Question content
          </FormLabel>
          {errors?.questionContent?.type === "required" && (
            <Text fontSize="16px" color="#bf1650">
              **This field is required
            </Text>
          )}
          <Controller
            name="questionContent"
            control={control}
            // defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <Box>
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
        </FormControl>
        <FormControl m="2">
          <FormLabel color="blue.600" htmlFor="paperId">
            Search Keys
          </FormLabel>
          {errors?.searchKeys?.type === "required" && (
            <Text fontSize="16px" color="#bf1650">
              **This field is required
            </Text>
          )}
          <Input {...register("searchKeys", { required: true, maxLength: 200 })} />
        </FormControl>
        <FormControl m="2">
          <FormLabel color="blue.600" htmlFor="paperId">
            Question Year
          </FormLabel>
          {errors.year && (
            <Text fontSize="16px" color="#bf1650">
              **Year should be from 1995 to 2021
            </Text>
          )}
          <Input type="number" {...register("year", { min: 1995, max: 2021 })} />
        </FormControl>
        <FormControl m="2">
          <FormLabel color="blue.600" htmlFor="paperId">
            Question sequence
          </FormLabel>
          {errors.sequence && (
            <Text fontSize="16px" color="#bf1650">
              **Sequence should be from 1 to 700
            </Text>
          )}
          <Input type="number" {...register("sequence", { min: 1, max: 700 })} />
        </FormControl>
        {/* <Editor name="description" defaultValue={description} control={control} placeholder="Write a Description..." /> */}
        <Button size="sm" mb="6" mt="6" color="yellow.900" bg="yellow" type="submit">
          {isEditMode ? "update question" : "create question"}
        </Button>
      </form>
      {/* <Button size="sm" mb="6" mt="6" color="yellow.900" bg="yellow" type="submit">
        Get data
      </Button> */}
      {questions ? (
        (questions as QuestionBank[]).map((x) => {
          return (
            <Box key={x.id} mb="6">
              <Button colorScheme = "blackAlpha" leftIcon={<MdMode />} size="xs" onClick={() => handleQuestionEdit(x)}>
                {isEditMode && currentEditId == x.id ? "Cancel Edit" : "Edit"}
              </Button>
              <Box>{x.year}</Box>
              <Box>
                <SunEditor
                  defaultValue={x.question_content}
                  // name={field.name}
                  setOptions={{
                    mode: "balloon",
                    //   katex: katex,
                    height: "100%",

                    //   buttonList: buttonList,
                  }}
                  placeholder="put ur content"
                  // setContents={field.value}
                  // onChange={field.onChange}
                />
              </Box>
            </Box>
          );
        })
      ) : (
        <div> no data </div>
      )}
    </Box>
  );
}
