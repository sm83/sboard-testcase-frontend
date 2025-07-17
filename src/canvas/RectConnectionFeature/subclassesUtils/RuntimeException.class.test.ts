import { RuntimeException } from "./RuntimeException.class";

describe("RuntimeException", () => {
	it("should create an instance with the provided error message", () => {
		const errorMessage = "Test error message";
		const exception = new RuntimeException(errorMessage);

		expect(exception).toBeInstanceOf(RuntimeException);
		expect(exception.error).toBe(errorMessage);
	});

	it("should have the error property accessible", () => {
		const errorMessage = "Another test message";
		const exception = new RuntimeException(errorMessage);

		expect(exception.error).toBeDefined();
		expect(exception.error).toEqual(errorMessage);
	});

	it("should allow changing the error message", () => {
		const exception = new RuntimeException("Runtime error message");
		const newMessage = "Updated message";

		exception.error = newMessage;

		expect(exception.error).toBe(newMessage);
	});
});
