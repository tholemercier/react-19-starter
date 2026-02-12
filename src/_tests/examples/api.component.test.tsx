import { render, screen, waitFor } from "@testing-library/react";

import { useApiDataExample } from "./hook.api.test";

const Component = () => {
  const apiData = useApiDataExample();

  return <div>{typeof apiData === "string" ? apiData : apiData.firstName}</div>;
};

test.skip("renders the Component with API data", async () => {
  render(<Component />);
  expect(screen.getByText(/no-data/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText(/John/i)).toBeInTheDocument());
});
