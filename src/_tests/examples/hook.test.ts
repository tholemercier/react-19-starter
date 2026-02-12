import { act, useState } from "react";

import { renderHook } from "@testing-library/react";

const useCounter = () => {
  const [count, setCount] = useState(0);
  return { count, increment: () => setCount((p) => p + 1) };
};

test.skip("should increment counter", () => {
  const { result } = renderHook(() => useCounter());

  // Wrap in act what triggers a re-rerender
  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
