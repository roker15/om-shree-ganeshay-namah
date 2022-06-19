import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { Center, FormControl, FormLabel, HStack, Select, Spinner, Text } from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { useGetExamPapers, useGetQuestionsByPaperidAndYear } from "../customHookes/useUser";
import { useAuthContext } from "../state/Authcontext";
import { QuestionBank } from "../types/myTypes";
// import Suneditor from "../components/Suneditor";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface IFormInput {
  paperId: number;
  questionContent?: string;
  searchKeys?: string;
  year?: number;
  sequence?: number;
  remark?: string;
}
const QuestionBanks: React.FC = () => {
  const [paperId, setPaperId] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [shouldfetch, setShouldfetch] = useState(false);
  const { examPapers, isLoading, isError } = useGetExamPapers(24);
  const { questions } = useGetQuestionsByPaperidAndYear(paperId, year, shouldfetch);

  const { profile } = useAuthContext();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value.year && value.year < 2022 && value.year > 1994) {
        setPaperId(value.paperId);
        setYear(value.year);
        setShouldfetch(true);
      } else {
        setYear(undefined);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  console.log("session null  nahi hai bhai");
  return (
    <Box>
      <>
        <form>
          <br />
          <FormControl>
            <CustomFormLabel text={"Exam paper :"} htmlfor={"paperId"} />
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
              {examPapers
                ?.sort((a, b) => {
                  return a.book_name > b.book_name ? 1 : -1;
                })
                .map((x) => {
                  return (
                    <option key={x.id} value={x.id}>
                      {x.book_name}
                    </option>
                  );
                })}
            </Select>
            {/* <FormErrorMessage>{errors.paperId && errors.paperId.message}</FormErrorMessage> */}
          </FormControl>
          <br />
          <FormControl>
            <CustomFormLabel text={"Question Year :"} htmlfor={"year"} />

            {errors.year && (
              <Text fontSize="16px" color="#bf1650">
                **Year should be from 1995 to 2021
              </Text>
            )}
            <Input
              id="year"
              placeholder="Year should be from 1995 to 2021"
              type="number"
              {...register("year", { min: 1995, max: 2021 })}
            />
          </FormControl>
        </form>
        {year && year != undefined && paperId ? (
          <Center mb="16">
            {" "}
            <Text as="u">
              Question Bank For Year <Text as="b"> {year}</Text> ({examPapers?.filter((x) => x.id == paperId)[0].book_name})
            </Text>
          </Center>
        ) : (
          <Center mb="16">Select Paper and Mention year (1995-2021) to view question bank</Center>
        )}
        {isLoading ? (
          <Spinner size="100px" /> //this is not visible test it again
        ) : questions && questions.length != 0 ? (
          (questions as QuestionBank[])
            .sort((a, b) => a.sequence! - b.sequence!)
            .map((x) => {
              return (
                <Box key={x.id} mb="2">
                  <QuestionBankEditor x={x} />
                </Box>
              );
            })
        ) : (
          <Box mb="16"> **No data for selected Paper & year</Box>
        )}
      </>
    </Box>
  );
};

export default QuestionBanks;

const CustomFormLabel: React.FC<{ text: string; htmlfor: string }> = ({ text, htmlfor }) => {
  return (
    <FormLabel
      color="blue.300"
      fontStyle="revert"
      fontFamily="sans-serif"
      textTransform={"capitalize"}
      fontWeight="normal"
      htmlFor={htmlfor}
    >
      {text}
      {/* Question Year : */}
    </FormLabel>
  );
};

// function questionBankEditor(x: QuestionBank): JSX.Element {
//   return (
//     <Box key={x.id} mb="2">
//       <HStack></HStack>
//       <EditorStyle>
//         <SunEditor
//           //   setDefaultStyle="font-family: arial; font-size: 16px;"
//           setContents={x.question_content}
//           hideToolbar={true}
//           readOnly={true}
//           //   disable={true}
//           autoFocus={false}
//           setOptions={{
//             mode: "balloon",
//             katex: katex,
//             height: "100%",
//           }}
//         />
//       </EditorStyle>
//     </Box>
//   );
// }
const EditorStyle = styled.div`
  .sun-editor {
    border: 0px solid blue;
  }
`;
interface PropsQuestionBankEditor {
  x: QuestionBank;
}
const QuestionBankEditor: React.FunctionComponent<PropsQuestionBankEditor> = ({ x }) => {
  
  
  return (
    <EditorStyle>
      <SunEditor
        //   setDefaultStyle="font-family: arial; font-size: 16px;"
        setContents={x.question_content}
        hideToolbar={true}
        readOnly={true}
        //   disable={true}
        autoFocus={false}
        setOptions={{
          mode: "balloon",
          katex: katex,
          height: "100%",
        }}
      />
    </EditorStyle>
  );
};
