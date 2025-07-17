import { Point } from "../types/Point.type";
import { getOffsetVertice } from "./getOffsettedVertice";

describe("getOffsetVertice", () => {
	// 1. Базовый тест - смещение положительными значениями
	it("should offset point with positive values", () => {
		const originalPoint: Point = { x: 10, y: 20 };
		const result = getOffsetVertice(originalPoint, 5, 10);

		expect(result).toEqual({ x: 15, y: 30 });
	});

	// 2. Смещение отрицательными значениями
	it("should offset point with negative values", () => {
		const originalPoint: Point = { x: 100, y: 200 };
		const result = getOffsetVertice(originalPoint, -30, -50);

		expect(result).toEqual({ x: 70, y: 150 });
	});

	// 3. Смещение нулевыми значениями (точка не меняется)
	it("should return same point when offsets are zero", () => {
		const originalPoint: Point = { x: 42, y: 24 };
		const result = getOffsetVertice(originalPoint, 0, 0);

		expect(result).toEqual(originalPoint);
	});

	// 4. Смещение по одной оси (X)
	it("should offset only X coordinate when Y offset is zero", () => {
		const originalPoint: Point = { x: 0, y: 10 };
		const result = getOffsetVertice(originalPoint, 15, 0);

		expect(result).toEqual({ x: 15, y: 10 });
	});

	// 5. Смещение по одной оси (Y)
	it("should offset only Y coordinate when X offset is zero", () => {
		const originalPoint: Point = { x: 5, y: 5 };
		const result = getOffsetVertice(originalPoint, 0, -3);

		expect(result).toEqual({ x: 5, y: 2 });
	});

	// 6. Обработка дробных чисел
	it("should handle fractional offsets correctly", () => {
		const originalPoint: Point = { x: 1.5, y: 2.5 };
		const result = getOffsetVertice(originalPoint, 0.25, -1.25);

		expect(result).toEqual({ x: 1.75, y: 1.25 });
	});

	// 7. Обработка крайних случаев (очень большие/малые числа)
	it("should handle extreme number values", () => {
		const originalPoint: Point = {
			x: Number.MAX_SAFE_INTEGER,
			y: Number.MIN_SAFE_INTEGER,
		};
		const result = getOffsetVertice(originalPoint, 1, -1);

		expect(result).toEqual({
			x: Number.MAX_SAFE_INTEGER + 1,
			y: Number.MIN_SAFE_INTEGER - 1,
		});
	});
});
