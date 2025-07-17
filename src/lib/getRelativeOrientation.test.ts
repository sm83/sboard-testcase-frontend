import { getRelativeOrientation } from "./getRelativeOrientation";
import type { RelativeOrientation } from "./getRelativeOrientation";

describe("getRelativeOrientation", () => {
	// Основные направления
	it('should return "bottom" for 0 degrees', () => {
		expect(getRelativeOrientation(0)).toBe("bottom");
	});

	it('should return "right" for 90 degrees', () => {
		expect(getRelativeOrientation(90)).toBe("right");
	});

	it('should return "top" for 180 degrees', () => {
		expect(getRelativeOrientation(180)).toBe("top");
	});

	it('should return "left" for 270 degrees', () => {
		expect(getRelativeOrientation(270)).toBe("left");
	});

	// Граничные случаи
	it('should return "incedent" for 360 degrees', () => {
		expect(getRelativeOrientation(360)).toBe("incedent");
	});

	it('should return "incedent" for negative angles', () => {
		expect(getRelativeOrientation(-90)).toBe("incedent");
	});

	it('should return "incedent" for non-cardinal angles', () => {
		expect(getRelativeOrientation(45)).toBe("incedent");
	});

	// Дробные значения
	it("should handle floating point angles", () => {
		expect(getRelativeOrientation(89.999)).toBe("incedent");
		expect(getRelativeOrientation(90.001)).toBe("incedent");
		expect(getRelativeOrientation(0.0001)).toBe("incedent");
	});

	// Специальные значения
	it("should handle extreme values", () => {
		expect(getRelativeOrientation(Number.MAX_SAFE_INTEGER)).toBe("incedent");
		expect(getRelativeOrientation(Number.MIN_SAFE_INTEGER)).toBe("incedent");
		expect(getRelativeOrientation(Infinity)).toBe("incedent");
		expect(getRelativeOrientation(-Infinity)).toBe("incedent");
		expect(getRelativeOrientation(NaN)).toBe("incedent");
	});
});

// Дополнительные проверки типов
describe("Type checks", () => {
	it("should always return RelativeOrientation type", () => {
		const orientations: RelativeOrientation[] = [
			"bottom",
			"right",
			"top",
			"left",
			"incedent",
		];

		const results = [
			getRelativeOrientation(0),
			getRelativeOrientation(90),
			getRelativeOrientation(180),
			getRelativeOrientation(270),
			getRelativeOrientation(45),
		];

		results.forEach((result) => {
			expect(orientations).toContain(result);
		});
	});
});
