import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { BookResponse } from "../../types/myTypes";

// const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());

const PAGE_SIZE = 6;

export default function Pagination() {
  const [cnt, setCnt] = useState(1);
  const [page, setPage] = useState([]);

  const pages = [];
  for (let i = 0; i < cnt; i++) {
    pages.push(<Page index={i} key={i} />);
  }

  return (
    <div>
      {<Page index={0}/>}
      <button onClick={() => setCnt(cnt + 1)}>Load More</button>
    </div>
  );
}
import useSWR from "swr";
import { definitions } from "../../types/supabase";
import { now } from "lodash";

function Page({ index }: { index: number }): JSX.Element {
  const [cursor, setCursor] = useState("2022-08-04 08:02:45.281618+00");
  const fetcher = async () =>
    await supabaseClient
      .from<definitions["books_articles"]>("books_articles")
      .select()
      .lt("updated_at", cursor) //"2022-08-04 08:02:45.281618+00"
      .order("updated_at", { ascending: false })
      .limit(10);

  const { data } = useSWR(`/api/data?page=${cursor}`, fetcher);
  useEffect(() => {
    () => {
      if (data && data.data && data.data[0]) {
        setCursor(data.data[0].updated_at!);
      }
    };
  });
  // ... handle loading and error states

  return (
    <>
      {data?.data?.map((item) => (
        <div key={item.id}>{item.article_title}</div>
      ))}
    </>
  );
}
