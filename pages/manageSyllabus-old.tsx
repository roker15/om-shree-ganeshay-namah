import { Box } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import React from "react";
import CreateBookSyllabus from "../components/syllabus/CreateBookSyllabus";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { useAuthContext } from "../state/Authcontext";
import PageWithLayoutType from "../types/pageWithLayout";

const ManageSyllabus: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const user = useUser();

  return <Box minW="full">{user && profile?.role === "ADMIN" && <CreateBookSyllabus />} </Box>;
};

(ManageSyllabus as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default ManageSyllabus;
