import { useState, useEffect } from "react";

//custome hook to GET data from the backend
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    // for useEffect cleanup
    const abortCont = new AbortController();

    const myInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      cache: "default",
      signal: abortCont.signal,
    };

    try {
      const res = await fetch(url, myInit);
      if (!res.ok) {
        throw Error("Could not fetch data for that resource");
      }
      const jsonRes = await res.json();
      setIsPending(false);
      setData(jsonRes);
      setError(null);
    } catch (err) {
      // we want to recognize abort error caused by switching page while data was being fetched
      // code: 20, name: "AbortError"
      if (err.code === 20) {
        console.log("fetch aborted");
      } else {
        setError(err.message);
        setIsPending(false);
      }
    }

    return () => {
      // cleanup function
      abortCont.abort();
    };
  };

  useEffect(() => {
    fetchData();
  }, [url]); //whenever the url changes, the useEffect gets executed

  return {
    data: data,
    isPending: isPending,
    error: error,
  };
};

export default useFetch;
