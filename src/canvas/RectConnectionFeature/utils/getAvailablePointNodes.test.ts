import { Point } from "../types/Point.type";
import PointNode from "../subclassesUtils/PointNode.class";
import { raycastIsIntersectingByAnyEdge } from "./raycast";
import { getAvailablePointNodes } from "./getAvailablePointNodes";
import RectEdge from "../types/RectEdge.type";

// Мок функции raycastIsIntersectingByAnyEdge
jest.mock("./raycast", () => ({
	raycastIsIntersectingByAnyEdge: jest.fn(),
}));

// Мок класса PointNode с сохранением основной логики
jest.mock("../subclassesUtils/PointNode.class", () => {
	return jest
		.fn()
		.mockImplementation(
			({ vertice, alignment, offsetDistance, otherRectangular }) => {
				// Упрощенная реализация конструктора PointNode
				let position: Point;
				let correct = true;

				if (typeof alignment === "number") {
					// Логика для числового alignment
					switch (alignment) {
						case 0:
							position = { x: vertice.x, y: vertice.y + offsetDistance };
							break;
						case 90:
							position = { x: vertice.x + offsetDistance, y: vertice.y };
							break;
						case 180:
							position = { x: vertice.x, y: vertice.y - offsetDistance };
							break;
						case 270:
							position = { x: vertice.x - offsetDistance, y: vertice.y };
							break;
						default:
							position = vertice;
							correct = false;
					}
				} else {
					// Логика для строкового alignment
					switch (alignment) {
						case "bottom-right":
							position = {
								x: vertice.x + offsetDistance,
								y: vertice.y + offsetDistance,
							};
							break;
						case "top-right":
							position = {
								x: vertice.x + offsetDistance,
								y: vertice.y - offsetDistance,
							};
							break;
						case "top-left":
							position = {
								x: vertice.x - offsetDistance,
								y: vertice.y - offsetDistance,
							};
							break;
						case "bottom-left":
							position = {
								x: vertice.x - offsetDistance,
								y: vertice.y + offsetDistance,
							};
							break;
						default:
							position = vertice;
							correct = false;
					}
				}

				return {
					position,
					correct,
					alignment,
					offsetDistance,
					otherRectangular,
					getError: jest.fn(),
					clearError: jest.fn(),
				};
			}
		);
});

describe("getAvailablePointNodes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(raycastIsIntersectingByAnyEdge as jest.Mock).mockReturnValue(false);
	});

	it("should return empty array when no edges provided", () => {
		const result = getAvailablePointNodes({
			ray: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
			usedPointNodes: [],
			allEdges: [],
		});

		expect(result).toEqual([]);
	});

	it("should filter out incorrect point nodes", () => {
		const mockEdges: RectEdge[] = [
			{
				pointNodes: [
					new PointNode({
						vertice: { x: 1, y: 1 },
						alignment: "bottom-right",
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
					new PointNode({
						vertice: { x: 1, y: 1 },
						alignment: 15, // Это сделает correct = false
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
				],
			} as unknown as RectEdge,
		];

		const result = getAvailablePointNodes({
			ray: { start: { x: 0, y: 0 }, end: { x: 2, y: 2 } },
			usedPointNodes: [],
			allEdges: mockEdges,
		});

		expect(result).toHaveLength(1);
		expect(result[0].position).toEqual({ x: 2, y: 2 });
	});

	it("should filter out duplicate point nodes", () => {
		const mockEdges: RectEdge[] = [
			{
				pointNodes: [
					new PointNode({
						vertice: { x: 1, y: 1 },
						alignment: "bottom-right",
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
					new PointNode({
						vertice: { x: 1, y: 1 },
						alignment: "bottom-right",
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
				],
			} as unknown as RectEdge,
		];

		const result = getAvailablePointNodes({
			ray: { start: { x: 0, y: 0 }, end: { x: 2, y: 2 } },
			usedPointNodes: [],
			allEdges: mockEdges,
		});

		expect(result).toHaveLength(1);
	});

	it("should filter out used point nodes", () => {
		const mockEdges: RectEdge[] = [
			{
				pointNodes: [
					new PointNode({
						vertice: { x: 1, y: 1 },
						alignment: "bottom-right",
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
				],
			} as unknown as RectEdge,
		];

		const usedPointNodes = [
			{
				position: { x: 2, y: 2 },
				correct: true,
			},
		] as PointNode[];

		const result = getAvailablePointNodes({
			ray: { start: { x: 0, y: 0 }, end: { x: 2, y: 2 } },
			usedPointNodes,
			allEdges: mockEdges,
		});

		expect(result).toHaveLength(0);
	});

	it("should filter out point nodes blocked by edges", () => {
		const mockEdges: RectEdge[] = [
			{
				pointNodes: [
					new PointNode({
						vertice: { x: 1, y: 1 },
						alignment: "bottom-right",
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
				],
			} as unknown as RectEdge,
		];

		(raycastIsIntersectingByAnyEdge as jest.Mock).mockReturnValueOnce(true);

		const result = getAvailablePointNodes({
			ray: { start: { x: 0, y: 0 }, end: { x: 2, y: 2 } },
			usedPointNodes: [],
			allEdges: mockEdges,
		});

		expect(result).toHaveLength(0);
		expect(raycastIsIntersectingByAnyEdge).toHaveBeenCalledWith({
			ray: { start: { x: 0, y: 0 }, end: { x: 2, y: 2 } },
			edges: mockEdges,
		});
	});

	it("should handle complex case with all filters", () => {
		const mockEdges: RectEdge[] = [
			{
				pointNodes: [
					// Correct, unique
					new PointNode({
						vertice: { x: 1, y: 1 },
						alignment: "bottom-right",
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
					// Incorrect (alignment = 500)
					new PointNode({
						vertice: { x: 1, y: 1 },
						alignment: 500,
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
					// Duplicate of first
					new PointNode({
						vertice: { x: 1, y: 1 },
						alignment: "bottom-right",
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
				],
			} as unknown as RectEdge,
			{
				pointNodes: [
					// Will be marked as used
					new PointNode({
						vertice: { x: 2, y: 2 },
						alignment: "top-right",
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
					// Will be blocked by raycast
					new PointNode({
						vertice: { x: 3, y: 3 },
						alignment: "top-left",
						offsetDistance: 1,
						otherRectangular: {
							position: { x: 0, y: 0 },
							size: { width: 2, height: 2 },
						},
					}),
				],
			} as unknown as RectEdge,
		];

		const usedPointNodes = [
			{
				position: { x: 3, y: 1 },
				correct: true,
			},
		] as PointNode[];

		(raycastIsIntersectingByAnyEdge as jest.Mock).mockImplementation(
			({ ray }) => {
				// Блокируем только путь к {x: 4, y: 0}
				return ray.end.x === 4 && ray.end.y === 0;
			}
		);

		const result = getAvailablePointNodes({
			ray: { start: { x: 0, y: 0 }, end: { x: 4, y: 4 } },
			usedPointNodes,
			allEdges: mockEdges,
		});

		expect(result).toHaveLength(1);
		expect(result[0].position).toEqual({ x: 2, y: 2 });
	});
});
