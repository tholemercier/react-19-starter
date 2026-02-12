import "@testing-library/jest-dom";
import { setupServer } from "msw/node";

import handlers from "./mocks/handlers";

const server = setupServer(...handlers);

// Start server before running tests
beforeAll(() => server.listen());

// Reset handlers after each test (to avoid state leaks)
afterEach(() => server.resetHandlers());

// Close server after tests are done
afterAll(() => server.close());
