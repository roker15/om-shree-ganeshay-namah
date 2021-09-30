import { Heading, Select, Stack } from "@chakra-ui/react";
import { AuthSession } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";

import { useAppContext } from "../context/state";
import TopAndSideNavbar from "../layout/TopAndSideNavbar";
import MainLayout from "../layout/LayoutWithTopAndSideNavbar";
// import SideNavBar from "../layout/sideNavBar";
import { Profile } from "../lib/constants";
import { supabase } from "../lib/supabaseClient";
import { Post } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";
import Link from 'next/link'
// const DynamicComponent = dynamic(() => import("../layout/sideNavBar"),{ ssr: false });
// const DynamicEditorComponent = dynamic(() => import("../components/Suneditor"),{ ssr: false });
import EditorComponent from "../components/Suneditor";
import { useAuthContext } from "../context/Authcontext";
import FileInput from "../components/FileInput";
type ProfileListProps = {
  data: Post[];
};

const Home: React.FC<ProfileListProps> = ({ data }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  // const [data, setProfiles] = useState<Profile[]>([]);
  const shareContext = useAppContext();
  const authcontext = useAuthContext();

  useEffect(() => {
    // if(!supabase.auth.session)
    // { authcontext.signUp() }
    // async function fetchData() {
    //   const user = supabase.auth.user();
    //   const { data } = await supabase.from<Profile>("profiles").upsert({id:user?.id,username:"phir se ",role:"madarchod" });
    //   // ...
    // }
    // fetchData();
    
    
    // setSession(supabase.auth.session());

    // supabase.auth.onAuthStateChange((_event: string, session: AuthSession | null) => {
    //   setSession(session);
    //   console.log("this is session stored in local storage ", session);
    // });
  }, []);

  useEffect(() => {
    console.log("inside component ", data);
  }, [data]);
  useEffect(() => {
    // console.log("data id at position 0 ", data[0].subheading_id.main_topic_id.id);

    
    // shareContext.setPostHeadingId(data![0].subheading_id.main_topic_id!.id);
  }, []);

  const [value, setValue] = React.useState("");
  const handleChange = (event: any) => {
    setValue(event.target.value);
    console.log("hello hello ", value);
  };

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <h1>
        {" "}
        shared context id is:
        {shareContext.postHeadingId}
      </h1>
      <h1> value is :{value}</h1>
      {/* <DynamicComponent test={data[0].post} /> */}
      {/* <DynamicEditorComponent /> */}
      <FileInput/>
      {/* <EditorComponent/> */}
      <Heading className="title">
        Do you want to reply on this post?{" "}
        <Link href="/editor">
          <a>Create New Post for this topics!</a>
        </Link>
      </Heading>

      <Stack>
        <Select placeholder="Select option" variant="outline" onChange={handleChange}>
          {data!.map((number) => {
            console.log("ho raha haw ");
            return (
              <option key={number.id} value={number.id}>
                {number.post}
              </option>
            );
          })}
        </Select>
      </Stack>
    </div>
  );
};

const DynamicComponentWithNoSSR = dynamic(() => import("../components/Account"), { ssr: false });

export const getStaticProps = async () => {
  // Make a request
  let { data, error } = await supabase.from<Post>("posts").select(`
  id,
    created_at,
    updated_at,
    post,
    subheading_id (
    
    topic,
    main_topic_id(id)
  )
 
`);
 
  // const res = await fetch("https://.../data");
  console.log("data is ", data);
  return {
    props: {
      data,
    },
  };
};

(Home as PageWithLayoutType).layout = MainLayout;
export default Home;
