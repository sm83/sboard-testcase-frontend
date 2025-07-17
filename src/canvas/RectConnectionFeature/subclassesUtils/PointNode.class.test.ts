import { Point } from "../types/Point.type";
import { Rect } from "../types/Rect.type";
import { InitException } from "./InitException.class";
import PointNode from "./PointNode.class";

describe("PointNode", () => {
	const mockRect: Rect = {
		position: { x: 1000, y: 1000 },
		size: { width: 200, height: 150 },
	};
	const mockVertice: Point = { x: 150, y: 150 };
	const mockVerticeInsideRect: Point = { x: 1000, y: 1000 };
	const mockOffset = 10;

	describe("constructor with alignment number (angle)", () => {
		it("should create correct point for angle 0 (down)", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: 0,
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.position).toEqual({ x: 150, y: 160 });
			expect(node.correct).toBeTruthy();
			expect(node.getError()).toBeNull();
		});

		it("should create correct point for angle 90 (right)", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: 90,
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.position).toEqual({ x: 160, y: 150 });
			expect(node.correct).toBeTruthy();
			expect(node.getError()).toBeNull();
		});

		it("should create correct point for angle 180 (up)", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: 180,
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.position).toEqual({ x: 150, y: 140 });
			expect(node.correct).toBeTruthy();
			expect(node.getError()).toBeNull();
		});

		it("should create correct point for angle 270 (left)", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: 270,
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.position).toEqual({ x: 140, y: 150 });
			expect(node.correct).toBeTruthy();
			expect(node.getError()).toBeNull();
		});

		it("should set error for invalid angle", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: 45, // invalid angle
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.position).toEqual(mockVertice);
			expect(node.correct).toBeFalsy();
			expect(node.getError()).toBeInstanceOf(InitException);
		});
	});

	describe("constructor with VerticeNormalAlignment", () => {
		it("should create correct point for bottom-right alignment", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: "bottom-right",
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.position).toEqual({ x: 160, y: 160 });
			expect(node.correct).toBeTruthy();
		});

		it("should create correct point for top-right alignment", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: "top-right",
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.position).toEqual({ x: 160, y: 140 });
			expect(node.correct).toBeTruthy();
		});

		it("should create correct point for top-left alignment", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: "top-left",
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.position).toEqual({ x: 140, y: 140 });
			expect(node.correct).toBeTruthy();
		});

		it("should create correct point for bottom-left alignment", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: "bottom-left",
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.position).toEqual({ x: 140, y: 160 });
			expect(node.correct).toBeTruthy();
		});
	});

	describe("#checkCorrectnessOfIntersection", () => {
		it("should return false when point intersects with rectangle", () => {
			const node = new PointNode({
				vertice: mockVerticeInsideRect,
				alignment: "bottom-right",
				offsetDistance: 60, // large enough to intersect
				otherRectangular: mockRect,
			});

			expect(node.correct).toBeFalsy();
		});

		it("should return true when point does not intersect with rectangle", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: "bottom-right",
				offsetDistance: 10, // small enough to not intersect
				otherRectangular: mockRect,
			});

			expect(node.correct).toBeTruthy();
		});
	});

	describe("error handling", () => {
		it("should clear error", () => {
			const node = new PointNode({
				vertice: mockVertice,
				alignment: 45, // invalid angle to trigger error
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.getError()).not.toBeNull();
			node.clearError();
			expect(node.getError()).toBeNull();
		});
	});

	describe("#getConnectionPointOffsetted", () => {
		// This is a private method, but we can test its behavior indirectly through constructor
		it("should return null for invalid angle", () => {
			// Indirectly test by creating node with invalid angle
			const node = new PointNode({
				vertice: mockVertice,
				alignment: 45,
				offsetDistance: mockOffset,
				otherRectangular: mockRect,
			});

			expect(node.getError()).not.toBeNull();
		});
	});
});
