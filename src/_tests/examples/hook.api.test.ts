import { useEffect, useState } from "react";

import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

export const hookApiTestExample = http.get("/api/data", () => {
  return HttpResponse.json({
    firstName: "John",
  });
});

const fn = async () => {
  const result = await fetch("/api/data");
  const data = result.json();

  return data;
};

const useApi = () => {
  const [data, setData] = useState<{ firstName: string } | undefined>();

  useEffect(() => {
    const exec = async () => {
      const r = await fn();
      setData(r);
    };
    exec();
  }, []);

  return { data };
};

export const useApiDataExample = () => {
  const { data } = useApi();
  return data ?? "no-data";
};

test.skip("should get async hook state update", async () => {
  const { result } = renderHook(() => useApiDataExample());

  expect(result.current).toEqual("no-data");

  await waitFor(() =>
    expect(result.current).toEqual({
      firstName: "John",
    }),
  );
});
