import { useState } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const Button = () => {
  const [fired, setFired] = useState(false);

  // eslint-disable-next-line react/jsx-no-bind
  return <div onClick={() => setFired(true)}>{fired ? "fired" : "waiting"}</div>;
};

const PureButton = ({ onClick }: { onClick: () => void }) => {
  return <div onClick={onClick}>button</div>;
};

test.skip("renders the button", async () => {
  render(<Button />);
  expect(screen.getByText(/waiting/i)).toBeInTheDocument();
  await userEvent.click(screen.getByText(/waiting/i));
  expect(screen.getByText(/fired/i)).toBeInTheDocument();
});

test.skip("renders the pure button and check function called using vi mock", async () => {
  const handleClick = vi.fn();
  render(<PureButton onClick={handleClick} />);
  expect(screen.getByText(/button/i)).toBeInTheDocument();
  await userEvent.click(screen.getByText(/button/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
