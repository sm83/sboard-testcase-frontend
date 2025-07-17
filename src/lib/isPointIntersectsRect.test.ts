import { isPointIntersectsRect } from "./isPointIntersectsRect";
import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";

describe("isPointIntersectsRect", () => {
	// Прямоугольник: left=10, right=50, top=20, bottom=60
	const testRect = {
		left: 10,
		right: 50,
		top: 20,
		bottom: 60,
	};

	// 1. Точка внутри прямоугольника
	it("should return true for point inside rectangle", () => {
		const point: Point = { x: 30, y: 40 };
		expect(isPointIntersectsRect({ point, ...testRect })).toBe(true);
	});

	// 2. Точка на границе прямоугольника
	it("should return true for point on rectangle border", () => {
		expect(
			isPointIntersectsRect({ point: { x: 10, y: 20 }, ...testRect })
		).toBe(true); // Левый верхний угол
		expect(
			isPointIntersectsRect({ point: { x: 50, y: 60 }, ...testRect })
		).toBe(true); // Правый нижний угол
	});

	// 3. Точка вне прямоугольника
	it("should return false for point outside rectangle", () => {
		const testCases: Point[] = [
			{ x: 5, y: 30 }, // Слева
			{ x: 55, y: 30 }, // Справа
			{ x: 30, y: 10 }, // Сверху
			{ x: 30, y: 65 }, // Снизу
			{ x: 5, y: 10 }, // Слева сверху
			{ x: 55, y: 65 }, // Справа снизу
		];

		testCases.forEach((point) => {
			expect(isPointIntersectsRect({ point, ...testRect })).toBe(false);
		});
	});

	// 4. Прямоугольник с нулевой площадью
	it("should handle zero-area rectangle", () => {
		const zeroRect = { left: 10, right: 10, top: 20, bottom: 20 };
		expect(
			isPointIntersectsRect({ point: { x: 10, y: 20 }, ...zeroRect })
		).toBe(true);
		expect(
			isPointIntersectsRect({ point: { x: 11, y: 21 }, ...zeroRect })
		).toBe(false);
	});

	// 5. Дробные координаты
	it("should work with fractional coordinates", () => {
		const fractionalRect = {
			left: 10.5,
			right: 50.5,
			top: 20.5,
			bottom: 60.5,
		};

		expect(
			isPointIntersectsRect({ point: { x: 10.5, y: 20.5 }, ...fractionalRect })
		).toBe(true);
		expect(
			isPointIntersectsRect({ point: { x: 50.5, y: 60.5 }, ...fractionalRect })
		).toBe(true);
		expect(
			isPointIntersectsRect({ point: { x: 10.4, y: 20.6 }, ...fractionalRect })
		).toBe(false);
	});
});
