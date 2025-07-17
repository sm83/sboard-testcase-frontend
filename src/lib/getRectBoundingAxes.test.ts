import { getRectBoundingAxes } from "./getRectBoundingAxes";
import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";

describe("getRectBoundingAxes", () => {
	// 1. Базовый тест - прямоугольник без отступа
	it("should return correct axes for rectangle without offset", () => {
		const rect: Rect = {
			position: { x: 100, y: 100 },
			size: { width: 200, height: 150 },
		};

		const result = getRectBoundingAxes({ rect });

		expect(result).toEqual([0, 200, 25, 175]); // [left, right, top, bottom]
	});

	// 2. Прямоугольник с отступом
	it("should apply offset correctly", () => {
		const rect: Rect = {
			position: { x: 50, y: 50 },
			size: { width: 100, height: 80 },
		};

		const result = getRectBoundingAxes({ rect, offset: 10 });

		expect(result).toEqual([-10, 110, 0, 100]);
	});

	// 3. Отрицательный отступ (сужает прямоугольник)
	it("should handle negative offset (shrinking)", () => {
		const rect: Rect = {
			position: { x: 0, y: 0 },
			size: { width: 60, height: 40 },
		};

		const result = getRectBoundingAxes({ rect, offset: -5 });

		expect(result).toEqual([-25, 25, -15, 15]);
	});

	// 4. Прямоугольник с нулевыми размерами
	it("should work with zero-sized rectangle", () => {
		const rect: Rect = {
			position: { x: 30, y: 30 },
			size: { width: 0, height: 0 },
		};

		const result = getRectBoundingAxes({ rect, offset: 2 });

		expect(result).toEqual([28, 32, 28, 32]);
	});

	// 5. Прямоугольник с дробными значениями
	it("should handle fractional values correctly", () => {
		const rect: Rect = {
			position: { x: 10.5, y: 20.5 },
			size: { width: 30.2, height: 40.4 },
		};

		const result = getRectBoundingAxes({ rect, offset: 1.1 });

		expect(result[0]).toBeCloseTo(-5.7);
		expect(result[1]).toBeCloseTo(26.7);
		expect(result[2]).toBeCloseTo(-0.8);
		expect(result[3]).toBeCloseTo(41.8);
	});

	// 6. Крайний случай - очень большой offset
	it("should handle extremely large offset", () => {
		const rect: Rect = {
			position: { x: 100, y: 100 },
			size: { width: 1, height: 1 },
		};

		const result = getRectBoundingAxes({
			rect,
			offset: Number.MAX_SAFE_INTEGER,
		});

		expect(result).toEqual([
			100 - 0.5 - Number.MAX_SAFE_INTEGER,
			100 + 0.5 + Number.MAX_SAFE_INTEGER,
			100 - 0.5 - Number.MAX_SAFE_INTEGER,
			100 + 0.5 + Number.MAX_SAFE_INTEGER,
		]);
	});
});
