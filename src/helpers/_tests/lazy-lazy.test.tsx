import { act, render, screen } from "@testing-library/react";
import type { Mock } from "vitest";

import { lazyLazy, lazyLazyWithProps } from "../lazy-lazy";

describe("lazy-lazy Test Suite", () => {
  describe("lazyLazy function", () => {
    let factoryMock: Mock;

    beforeEach(() => {
      factoryMock = vi.fn().mockResolvedValue({ default: () => <div>Lazy Loaded Component</div> });
    });

    it("should pass props correctly to the lazy-loaded component", async () => {
      const Component = lazyLazy(factoryMock, <div>Custom...</div>);

      act(() => {
        render(<Component />);
      });

      expect(screen.queryByText("Custom...")).toBeInTheDocument();

      const el = await screen.findByText("Lazy Loaded Component");
      expect(el).toBeInTheDocument();
    });

    it("should render the default fallback when no fallback is provided", async () => {
      const Component = lazyLazy(factoryMock);
      act(() => {
        render(<Component />);
      });

      expect(screen.queryByText("Lazy Loaded Component")).not.toBeInTheDocument();

      const el = await screen.findByText("Lazy Loaded Component");
      expect(el).toBeInTheDocument();
    });
  });
  describe("lazyLazyWithProps function", () => {
    let factoryMock: Mock;

    beforeEach(() => {
      factoryMock = vi.fn().mockResolvedValue({
        default: ({ someProp }: { someProp: string }) => <div>{someProp}</div>,
      });
    });

    it("should pass props correctly to the lazy-loaded component", async () => {
      const Component = lazyLazyWithProps(factoryMock, { someProp: "test" }, <div>Custom...</div>);

      act(() => {
        render(<Component />);
      });

      expect(screen.queryByText("Custom...")).toBeInTheDocument();

      const el = await screen.findByText("test");
      expect(el).toBeInTheDocument();
    });

    it("should render the default fallback when no fallback is provided", async () => {
      const Component = lazyLazyWithProps(factoryMock, { someProp: "test" });
      act(() => {
        render(<Component />);
      });

      expect(screen.queryByText("test")).not.toBeInTheDocument();

      const el = await screen.findByText("test");
      expect(el).toBeInTheDocument();
    });
  });
});
