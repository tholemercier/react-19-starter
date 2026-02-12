import { jsonDatesReviver, safeParseJson, safeParseJsonFactory } from "../json";

describe("Json Helpers Test Suite", () => {
  describe("safeParseJson & safeParseJsonFactory", () => {
    const parseJson = safeParseJsonFactory();
    it("should parse a valid JSON object", () => {
      expect(safeParseJson('{"key": "value"}')).toEqual({ key: "value" });
      expect(parseJson('{"key": "value"}')).toEqual({ key: "value" });
    });

    it("should return null for null input", () => {
      expect(safeParseJson(null)).toBeNull();
      expect(parseJson("null")).toBeNull();
    });

    it("should parse a valid JSON number", () => {
      expect(safeParseJson("42")).toBe(42);
      expect(parseJson("42")).toBe(42);
    });

    it("should parse a valid JSON array", () => {
      expect(safeParseJson("[1,2,3]")).toEqual([1, 2, 3]);
      expect(parseJson("[1,2,3]")).toEqual([1, 2, 3]);
    });

    it("should return null for invalid JSON", () => {
      expect(safeParseJson("invalid json")).toBeNull();
      expect(parseJson("invalid json")).toBeNull();
    });

    it("should return null for incorrectly formatted object", () => {
      expect(safeParseJson("{key: value}")).toBeNull();
      expect(parseJson("{key: value}")).toBeNull();
    });

    it("should return null for an unterminated JSON structure", () => {
      expect(safeParseJson('{"unterminated": ')).toBeNull();
      expect(parseJson('{"unterminated": ')).toBeNull();
    });
  });

  describe("jsonDatesReviver", () => {
    it("should convert ISO date strings to Date objects for keys ending with 'At'", () => {
      const result = jsonDatesReviver("createdAt", "2023-06-01T12:34:56.789Z");
      expect(result).toBeInstanceOf(Date);
      expect((result as Date).toISOString()).toBe("2023-06-01T12:34:56.789Z");
    });

    it("should convert ISO date strings to Date objects for key 'timestamp'", () => {
      const result = jsonDatesReviver("timestamp", "2023-06-01T12:34:56.789Z");
      expect(result).toBeInstanceOf(Date);
      expect((result as Date).toISOString()).toBe("2023-06-01T12:34:56.789Z");
    });

    it("should convert ISO date strings to Date objects for key 'isoDate'", () => {
      const result = jsonDatesReviver("isoDate", "2023-06-01T12:34:56.789Z");
      expect(result).toBeInstanceOf(Date);
      expect((result as Date).toISOString()).toBe("2023-06-01T12:34:56.789Z");
    });

    it("should not convert strings that do not match the ISO format", () => {
      const result = jsonDatesReviver("createdAt", "not-a-date");
      expect(result).toBe("not-a-date");
    });

    it("should not convert strings with incorrect length", () => {
      const result = jsonDatesReviver("createdAt", "2023-06-01T12:34:56Z"); // Missing milliseconds
      expect(result).toBe("2023-06-01T12:34:56Z");
    });

    it("should not convert values that are not strings", () => {
      expect(jsonDatesReviver("createdAt", 123_456)).toBe(123_456);
      expect(jsonDatesReviver("createdAt", null)).toBeNull();
      expect(jsonDatesReviver("createdAt", {})).toEqual({});
    });

    it("should not convert values for keys that do not match the conditions", () => {
      expect(jsonDatesReviver("randomKey", "2023-06-01T12:34:56.789Z")).toBe("2023-06-01T12:34:56.789Z");
    });
  });
});
