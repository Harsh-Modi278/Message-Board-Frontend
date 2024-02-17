import { useEffect, useState } from "react";

interface FetchResult<T> {
  data: T | null;
  isPending: boolean;
  error: string | null;
}

// there's a few bugs in this code: https://tkdodo.eu/blog/why-you-want-react-query
export const useFetch = <T>(url: string): FetchResult<T> => {
  console.log("useFetch - url: ", url);
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    const abortCont: AbortController = new AbortController();

    try {
      const res: Response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        cache: "default",
        signal: abortCont.signal,
      });
      if (!res.ok) {
        throw new Error("Could not fetch data for that resource");
      }
      const jsonRes = await res.json();
      setIsPending(false);
      setData(jsonRes);
      setError(null);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("fetch aborted");
      } else {
        console.log({ err });
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      const abortCont = new AbortController();
      abortCont.abort();
    };
  }, [url]);

  console.debug({
    data,
    isPending,
    error,
  });

  return {
    data,
    isPending,
    error,
  };
};
