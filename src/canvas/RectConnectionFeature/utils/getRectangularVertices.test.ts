import { Point } from "../types/Point.type";
import { Rect } from "../types/Rect.type";
import { getRectangularVertices } from "./getRectangularVertices";

describe("getRectangularVertices", () => {
	it("should return correct vertices for a centered rectangle", () => {
		const rect: Rect = {
			position: { x: 0, y: 0 },
			size: { width: 4, height: 2 },
		};

		const expectedVertices: [Point, Point, Point, Point] = [
			// bottom-right
			{ x: 2, y: 1 },
			// top-right
			{ x: 2, y: -1 },
			// top-left
			{ x: -2, y: -1 },
			// bottom-left
			{ x: -2, y: 1 },
		];

		const result = getRectangularVertices(rect);
		expect(result).toEqual(expectedVertices);
	});

	it("should return correct vertices for an offset rectangle", () => {
		const rect: Rect = {
			position: { x: 3, y: 5 },
			size: { width: 6, height: 4 },
		};

		const expectedVertices: [Point, Point, Point, Point] = [
			// bottom-right
			{ x: 6, y: 7 },
			// top-right
			{ x: 6, y: 3 },
			// top-left
			{ x: 0, y: 3 },
			// bottom-left
			{ x: 0, y: 7 },
		];

		const result = getRectangularVertices(rect);
		expect(result).toEqual(expectedVertices);
	});

	it("should return correct vertices for rectangle with odd dimensions", () => {
		const rect: Rect = {
			position: { x: 1, y: 1 },
			size: { width: 3, height: 5 },
		};

		const expectedVertices: [Point, Point, Point, Point] = [
			// bottom-right
			{ x: 2.5, y: 3.5 },
			// top-right
			{ x: 2.5, y: -1.5 },
			// top-left
			{ x: -0.5, y: -1.5 },
			// bottom-left
			{ x: -0.5, y: 3.5 },
		];

		const result = getRectangularVertices(rect);
		expect(result).toEqual(expectedVertices);
	});

	it("should return correct vertices for rectangle with zero size", () => {
		const rect: Rect = {
			position: { x: 10, y: 10 },
			size: { width: 0, height: 0 },
		};

		const expectedVertices: [Point, Point, Point, Point] = [
			// all points should be the same as position
			{ x: 10, y: 10 },
			{ x: 10, y: 10 },
			{ x: 10, y: 10 },
			{ x: 10, y: 10 },
		];

		const result = getRectangularVertices(rect);
		expect(result).toEqual(expectedVertices);
	});

	it("should maintain correct order of vertices (clockwise or counter-clockwise)", () => {
		const rect: Rect = {
			position: { x: 0, y: 0 },
			size: { width: 2, height: 2 },
		};

		const result = getRectangularVertices(rect);

		// Check order: bottom-right, top-right, top-left, bottom-left
		expect(result[0]).toEqual({ x: 1, y: 1 }); // bottom-right
		expect(result[1]).toEqual({ x: 1, y: -1 }); // top-right
		expect(result[2]).toEqual({ x: -1, y: -1 }); // top-left
		expect(result[3]).toEqual({ x: -1, y: 1 }); // bottom-left
	});
});
