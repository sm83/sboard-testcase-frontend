import PointNode from "../subclassesUtils/PointNode.class";
import { Rect } from "../types/Rect.type";
import { getRectangularsOffsettedEdges } from "./getRectangularsOffsettedEdges";

// Мок для PointNode, чтобы упростить тестирование
jest.mock("../subclassesUtils/PointNode.class", () => {
	return jest
		.fn()
		.mockImplementation(
			({ vertice, alignment, offsetDistance, otherRectangular }) => ({
				position: vertice,
				alignment,
				offsetDistance,
				otherRectangular,
				correct: true, // По умолчанию считаем корректным
			})
		);
});

describe("getRectangularsOffsettedEdges", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should return correct edges for a single rectangle", () => {
		const rectangulars: Rect[] = [
			{
				position: { x: 0, y: 0 },
				size: { width: 4, height: 2 },
			},
		];
		const offset = 1;

		const result = getRectangularsOffsettedEdges({ rectangulars, offset });

		expect(result).toHaveLength(4);

		// right
		expect(result[0].vertices).toEqual([
			{ x: 2, y: 1 },
			{ x: 2, y: -1 },
		]);
		expect(result[0].extrudedVertices).toEqual([
			{ x: 3, y: 2 },
			{ x: 3, y: -2 },
		]);
		expect(result[0].normal).toBe(90);

		// top
		expect(result[1].vertices).toEqual([
			{ x: 2, y: -1 },
			{ x: -2, y: -1 },
		]);
		expect(result[1].extrudedVertices).toEqual([
			{ x: 3, y: -2 },
			{ x: -3, y: -2 },
		]);
		expect(result[1].normal).toBe(180);

		// left
		expect(result[2].vertices).toEqual([
			{ x: -2, y: -1 },
			{ x: -2, y: 1 },
		]);
		expect(result[2].extrudedVertices).toEqual([
			{ x: -3, y: -2 },
			{ x: -3, y: 2 },
		]);
		expect(result[2].normal).toBe(270);

		// bottom
		expect(result[3].vertices).toEqual([
			{ x: -2, y: 1 },
			{ x: 2, y: 1 },
		]);
		expect(result[3].extrudedVertices).toEqual([
			{ x: -3, y: 2 },
			{ x: 3, y: 2 },
		]);
		expect(result[3].normal).toBe(0);
	});

	it("should return correct edges for two rectangles", () => {
		const rectangulars: Rect[] = [
			{
				position: { x: 0, y: 0 },
				size: { width: 4, height: 2 },
			},
			{
				position: { x: 5, y: 0 },
				size: { width: 4, height: 2 },
			},
		];
		const offset = 1;

		const result = getRectangularsOffsettedEdges({ rectangulars, offset });

		expect(result).toHaveLength(8);

		expect(PointNode).toHaveBeenCalledWith(
			expect.objectContaining({
				otherRectangular: rectangulars[0],
			})
		);
	});

	it("should handle empty input array", () => {
		const rectangulars: Rect[] = [];
		const offset = 1;

		const result = getRectangularsOffsettedEdges({ rectangulars, offset });

		expect(result).toHaveLength(0);
	});
});
