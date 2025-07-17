import isPointOnSegment from "./isPointOnSegment";
import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";

describe("isPointOnSegment", () => {
	// Базовый отрезок
	const segment = {
		vertice1: { x: 0, y: 0 },
		vertice2: { x: 10, y: 10 },
	};

	// Точка точно на отрезке
	it("should return true for point exactly on segment", () => {
		const point: Point = { x: 5, y: 5 };
		expect(isPointOnSegment({ ...segment, targetVertice: point })).toBe(true);
	});

	// Точка на вершинах отрезка
	it("should return true for segment vertices", () => {
		expect(
			isPointOnSegment({ ...segment, targetVertice: segment.vertice1 })
		).toBe(true);
		expect(
			isPointOnSegment({ ...segment, targetVertice: segment.vertice2 })
		).toBe(true);
	});

	// Точка за пределами отрезка
	it("should return false for point outside segment", () => {
		const testCases: Point[] = [
			{ x: -1, y: -1 },
			{ x: 11, y: 11 },
			{ x: 5, y: 6 },
			{ x: 10, y: 0 },
		];

		testCases.forEach((point) => {
			expect(isPointOnSegment({ ...segment, targetVertice: point })).toBe(
				false
			);
		});
	});

	// Точка на линии, но вне отрезка
	it("should return false for point on line but outside segment", () => {
		const point: Point = { x: -5, y: -5 }; // На продолжении линии
		expect(isPointOnSegment({ ...segment, targetVertice: point })).toBe(false);
	});

	// Горизонтальный и вертикальный отрезки
	it("should work with horizontal and vertical segments", () => {
		const horizontal = {
			vertice1: { x: 0, y: 0 },
			vertice2: { x: 10, y: 0 },
		};
		expect(
			isPointOnSegment({ ...horizontal, targetVertice: { x: 5, y: 0 } })
		).toBe(true);
		expect(
			isPointOnSegment({ ...horizontal, targetVertice: { x: 5, y: 0.1 } })
		).toBe(false);

		const vertical = {
			vertice1: { x: 0, y: 0 },
			vertice2: { x: 0, y: 10 },
		};
		expect(
			isPointOnSegment({ ...vertical, targetVertice: { x: 0, y: 5 } })
		).toBe(true);
		expect(
			isPointOnSegment({ ...vertical, targetVertice: { x: 0.1, y: 5 } })
		).toBe(false);
	});

	// Очень короткий отрезок
	it("should work with very small segments", () => {
		const smallSegment = {
			vertice1: { x: 0, y: 0 },
			vertice2: { x: 1e-10, y: 1e-10 },
		};
		expect(
			isPointOnSegment({
				...smallSegment,
				targetVertice: { x: 0.5e-10, y: 0.5e-10 },
			})
		).toBe(true);
	});

	// Дробные координаты
	it("should handle fractional coordinates", () => {
		const fracSegment = {
			vertice1: { x: 0.1, y: 0.2 },
			vertice2: { x: 0.3, y: 0.6 },
		};
		expect(
			isPointOnSegment({ ...fracSegment, targetVertice: { x: 0.2, y: 0.4 } })
		).toBe(true);
		expect(
			isPointOnSegment({
				...fracSegment,
				targetVertice: { x: 0.2, y: 0.400001 },
			})
		).toBe(false);
	});
});
