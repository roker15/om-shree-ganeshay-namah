import { useState } from "react";
import useSWR from "swr";
import { supabase } from "../lib/supabaseClient";
// import { AuthContext } from "../auth";
interface LayoutProps {
  test: string
}


const SideNavBar: React.FC<LayoutProps>= ({test}) => {
  const [state, setState] = useState(5);
  // const [email, setEmail] = useState(useContext(AuthContext));
  const changeState = () => {
    setState(state + 1);
  };
  // const fetcher = async () =>  await supabase.from("papers").select("*");

  // `data` will always be available as it's in `fallback`.
  const { data, error } = useSWR("/paper", async () => await supabase.from("papers").select("*"));
  const isData = data !== undefined;
  // return <h1>{data.title}</h1>;
  console.log("data inside swr----", data, "---------");
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  // render data
  return (
    <>
      <h1>this is side nav bar and test is { test}</h1>
      <div>

        hello{" "}
        {data.data!.map((x: { id: any }) => (
          <h1 key={x.id}>{x.id}</h1>
        ))}
      </div>
      !
    </>
  );
};
export default SideNavBar;
