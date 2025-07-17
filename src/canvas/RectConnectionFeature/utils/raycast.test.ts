import { AlignmentNormal } from "../types/AlignmentNormal.type";
import { Point } from "../types/Point.type";
import RectEdge from "../types/RectEdge.type";
import {
	raycastCheckIntersection,
	raycastDistanceMeasure,
	raycastIsIntersectingByAnyEdge,
} from "./raycast";

// Вспомогательная функция для создания тестового ребра
const createTestEdge = (
	vertices: [[number, number], [number, number]],
	extrudedVertices: [[number, number], [number, number]],
	normal: AlignmentNormal = 0
): RectEdge => ({
	vertices: [
		{ x: vertices[0][0], y: vertices[0][1] },
		{ x: vertices[1][0], y: vertices[1][1] },
	],
	extrudedVertices: [
		{ x: extrudedVertices[0][0], y: extrudedVertices[0][1] },
		{ x: extrudedVertices[1][0], y: extrudedVertices[1][1] },
	],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pointNodes: [{}, {}] as any,
	normal,
	id: Symbol(),
});

describe("raycastCheckIntersection", () => {
	it("should return true when ray intersects with edge vertices", () => {
		const edge = createTestEdge(
			[
				[0, 0],
				[10, 10],
			],
			[
				[0, 0],
				[10, 10],
			]
		);
		const ray = {
			start: { x: 0, y: 10 },
			end: { x: 10, y: 0 },
		};

		const result = raycastCheckIntersection({ ray, edge });
		expect(result).toBe(true);
	});

	it("should return false when ray does not intersect with edge vertices", () => {
		const edge = createTestEdge(
			[
				[0, 0],
				[10, 10],
			],
			[
				[0, 0],
				[10, 10],
			]
		);
		const ray = {
			start: { x: 0, y: 20 },
			end: { x: 10, y: 20 },
		};

		const result = raycastCheckIntersection({ ray, edge });
		expect(result).toBe(false);
	});

	it("should return true when ray intersects with extruded vertices", () => {
		const edge = createTestEdge(
			[
				[0, 0],
				[10, 10],
			], // Оригинальные вершины (не пересекаются с лучом)
			[
				[0, 0],
				[0, 10],
			] // Экструдированные вершины (пересекаются с лучом)
		);
		const ray = {
			start: { x: -5, y: 5 },
			end: { x: 5, y: 5 },
		};

		const result = raycastCheckIntersection({ ray, edge, useExtruded: true });
		expect(result).toBe(true);
	});

	it("should return false for parallel lines", () => {
		const edge = createTestEdge(
			[
				[0, 0],
				[10, 0],
			],
			[
				[0, 0],
				[10, 0],
			]
		);
		const ray = {
			start: { x: 0, y: 5 },
			end: { x: 10, y: 5 },
		};

		const result = raycastCheckIntersection({ ray, edge });
		expect(result).toBe(false);
	});

	it("should return true when ray starts on the edge", () => {
		const edge = createTestEdge(
			[
				[0, 0],
				[9, 9],
			],
			[
				[0, 0],
				[10, 10],
			]
		);
		const ray = {
			start: { x: 5, y: 5 },
			end: { x: 15, y: 15 },
		};

		const result = raycastCheckIntersection({ ray, edge });
		expect(result).toBe(true);
	});

	it("should return true when ray ends on the edge", () => {
		const edge = createTestEdge(
			[
				[0, 0],
				[9, 9],
			],
			[
				[0, 0],
				[10, 10],
			]
		);
		const ray = {
			start: { x: -5, y: -5 },
			end: { x: 5, y: 5 },
		};

		const result = raycastCheckIntersection({ ray, edge });
		expect(result).toBe(true);
	});

	it("should return false when intersection is outside segment bounds", () => {
		const edge = createTestEdge(
			[
				[0, 0],
				[10, 10],
			],
			[
				[0, 0],
				[10, 10],
			]
		);
		const ray = {
			start: { x: -10, y: -20 },
			end: { x: -5, y: -15 },
		};

		const result = raycastCheckIntersection({ ray, edge });
		expect(result).toBe(false);
	});

	it("should handle vertical edges correctly", () => {
		const edge = createTestEdge(
			[
				[5, 0],
				[5, 10],
			],
			[
				[5, 0],
				[5, 10],
			]
		);
		const ray = {
			start: { x: 0, y: 5 },
			end: { x: 10, y: 5 },
		};

		const result = raycastCheckIntersection({ ray, edge });
		expect(result).toBe(true);
	});

	it("should handle horizontal edges correctly", () => {
		const edge = createTestEdge(
			[
				[0, 5],
				[10, 5],
			],
			[
				[0, 5],
				[10, 5],
			]
		);
		const ray = {
			start: { x: 5, y: 0 },
			end: { x: 5, y: 10 },
		};

		const result = raycastCheckIntersection({ ray, edge });
		expect(result).toBe(true);
	});
});

describe("raycastDistanceMeasure", () => {
	it("should return 0 for the same point", () => {
		const point: Point = { x: 5, y: 5 };
		const result = raycastDistanceMeasure(point, point);
		expect(result).toBe(0);
	});

	it("should calculate correct horizontal distance", () => {
		const point1: Point = { x: 0, y: 0 };
		const point2: Point = { x: 10, y: 0 };
		const result = raycastDistanceMeasure(point1, point2);
		expect(result).toBe(10);
	});

	it("should calculate correct vertical distance", () => {
		const point1: Point = { x: 0, y: 0 };
		const point2: Point = { x: 0, y: 15 };
		const result = raycastDistanceMeasure(point1, point2);
		expect(result).toBe(15);
	});

	it("should calculate correct diagonal distance", () => {
		const point1: Point = { x: 0, y: 0 };
		const point2: Point = { x: 3, y: 4 };
		const result = raycastDistanceMeasure(point1, point2);
		expect(result).toBe(5);
	});

	it("should handle negative coordinates", () => {
		const point1: Point = { x: -2, y: -1 };
		const point2: Point = { x: 1, y: 2 };
		const result = raycastDistanceMeasure(point1, point2);
		expect(result).toBeCloseTo(Math.sqrt(18));
	});

	it("should handle floating point coordinates", () => {
		const point1: Point = { x: 1.5, y: 2.5 };
		const point2: Point = { x: 4.5, y: 6.5 };
		const result = raycastDistanceMeasure(point1, point2);
		expect(result).toBeCloseTo(5);
	});

	it("should be commutative (order of points doesnt matter)", () => {
		const point1: Point = { x: 10, y: 20 };
		const point2: Point = { x: 30, y: 40 };
		const result1 = raycastDistanceMeasure(point1, point2);
		const result2 = raycastDistanceMeasure(point2, point1);
		expect(result1).toBe(result2);
	});

	it("should handle large distances correctly", () => {
		const point1: Point = { x: 0, y: 0 };
		const point2: Point = { x: 10000, y: 10000 };
		const result = raycastDistanceMeasure(point1, point2);
		expect(result).toBeCloseTo(10000 * Math.sqrt(2));
	});
});

describe("raycastIsIntersectingByAnyEdge", () => {
	it("should return false for empty edges array", () => {
		const ray = { start: { x: 0, y: 0 }, end: { x: 10, y: 10 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges: [] })).toBe(false);
	});

	it("should detect intersection with horizontal edge", () => {
		const edges = [
			createTestEdge(
				[
					[0, 0],
					[10, 0],
				],
				[
					[0, -1],
					[10, -1],
				]
			),
		];
		const ray = { start: { x: 5, y: -5 }, end: { x: 5, y: 5 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges })).toBe(true);
	});

	it("should detect intersection with vertical edge", () => {
		const edges = [
			createTestEdge(
				[
					[0, 0],
					[0, 10],
				],
				[
					[-1, 0],
					[-1, 10],
				]
			),
		];
		const ray = { start: { x: -5, y: 5 }, end: { x: 5, y: 5 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges })).toBe(true);
	});

	it("should detect intersection with diagonal edge", () => {
		const edges = [
			createTestEdge(
				[
					[0, 0],
					[10, 10],
				],
				[
					[-1, -1],
					[9, 9],
				]
			),
		];
		const ray = { start: { x: 0, y: 10 }, end: { x: 10, y: 0 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges })).toBe(true);
	});

	it("should return false when no intersections exist", () => {
		const edges = [
			createTestEdge(
				[
					[0, 0],
					[10, 0],
				],
				[
					[0, -1],
					[10, -1],
				]
			),
			createTestEdge(
				[
					[0, 0],
					[0, 10],
				],
				[
					[-1, 0],
					[-1, 10],
				]
			),
		];
		const ray = { start: { x: 15, y: 15 }, end: { x: 20, y: 20 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges })).toBe(false);
	});

	it("should handle multiple edges with partial intersections", () => {
		const edges = [
			createTestEdge(
				[
					[0, 0],
					[10, 0],
				],
				[
					[0, -1],
					[10, -1],
				]
			), // пересекается
			createTestEdge(
				[
					[0, 10],
					[10, 10],
				],
				[
					[0, 9],
					[10, 9],
				]
			), // не пересекается
			createTestEdge(
				[
					[5, 0],
					[5, 10],
				],
				[
					[4, 0],
					[4, 10],
				]
			), // пересекается
		];
		const ray = { start: { x: 2, y: -5 }, end: { x: 2, y: 15 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges })).toBe(true);
	});

	it("should handle edge case when ray starts exactly on an edge", () => {
		const edges = [
			createTestEdge(
				[
					[0, 0],
					[10, 0],
				],
				[
					[0, -1],
					[10, -1],
				]
			),
		];
		const ray = { start: { x: 5, y: 0 }, end: { x: 5, y: 10 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges })).toBe(true);
	});

	it("should handle edge case when ray ends exactly on an edge", () => {
		const edges = [
			createTestEdge(
				[
					[0, 10],
					[10, 10],
				],
				[
					[0, 9],
					[10, 9],
				]
			),
		];
		const ray = { start: { x: 5, y: 0 }, end: { x: 5, y: 10 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges })).toBe(true);
	});

	it("should handle extruded vertices correctly", () => {
		const edges = [
			createTestEdge(
				[
					[0, 0],
					[10, 0],
				], // оригинальные вершины (не пересекаются)
				[
					[0, -5],
					[10, -5],
				] // экструдированные вершины (пересекаются)
			),
		];
		const ray = { start: { x: 5, y: -10 }, end: { x: 5, y: 5 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges })).toBe(true);
	});

	it("should respect edge normals when checking intersections", () => {
		const edges = [
			createTestEdge(
				[
					[0, 0],
					[10, 0],
				],
				[
					[0, -1],
					[10, -1],
				],
				90
			),
		];
		const ray = { start: { x: 5, y: -5 }, end: { x: 5, y: 5 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges })).toBe(true);
	});

	it("should handle floating point coordinates", () => {
		const edges = [
			createTestEdge(
				[
					[0.5, 0.5],
					[10.5, 0.5],
				],
				[
					[0.5, 0.4],
					[10.5, 0.4],
				]
			),
		];
		const ray = { start: { x: 5.5, y: -5.5 }, end: { x: 5.5, y: 5.5 } };
		expect(raycastIsIntersectingByAnyEdge({ ray, edges })).toBe(true);
	});
});
