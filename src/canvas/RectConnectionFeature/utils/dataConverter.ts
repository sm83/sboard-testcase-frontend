import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";
import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";
import { ConnectionPoint } from "@/canvas/RectConnectionFeature/types/ConnectionPoint.type";
import { RuntimeException } from "@/canvas/RectConnectionFeature/subclassesUtils/RuntimeException.class";
import { AlignmentNormal } from "@/canvas/RectConnectionFeature/types/AlignmentNormal.type";
import { isPointIntersectsRect } from "../../../lib/isPointIntersectsRect";
import { getRectBoundingAxes } from "../../../lib/getRectBoundingAxes";
import { getConnectionPointOffsetted } from "../../../lib/getConnectionPointOffsetted";
import NodePoint from "../types/NodePoint.type";
import RectEdge from "../types/RectEdge.type";
import PathNode from "../subclassesCanvas/PathNode.class";

const offsetDistance = 10;

export const getRectangularVertices = (
	rect: Rect
): [Point, Point, Point, Point] => {
	return [
		// bottom-right
		{
			x: rect.position.x + rect.size.width / 2,
			y: rect.position.y + rect.size.height / 2,
		},
		// top-right
		{
			x: rect.position.x + rect.size.width / 2,
			y: rect.position.y - rect.size.height / 2,
		},
		// top-left
		{
			x: rect.position.x - rect.size.width / 2,
			y: rect.position.y - rect.size.height / 2,
		},
		// bottom-left
		{
			x: rect.position.x - rect.size.width / 2,
			y: rect.position.y + rect.size.height / 2,
		},
	];
};

type VerticeAlignment =
	| "bottom-right"
	| "top-right"
	| "top-left"
	| "bottom-left";

const getNodePointFromVertice = ({
	vertice,
	alignment,
	otherRectangular,
}: {
	vertice: Point;
	alignment: VerticeAlignment;
	otherRectangular: Rect;
}): NodePoint => {
	const [left, right, top, bottom] = getRectBoundingAxes({
		rect: otherRectangular,
		offset: offsetDistance,
	});

	switch (alignment) {
		case "bottom-right": {
			const nodePointPosition: Point = {
				x: vertice.x + offsetDistance,
				y: vertice.y + offsetDistance,
			};
			return {
				position: nodePointPosition,
				correct: !isPointIntersectsRect({
					point: nodePointPosition,
					left,
					right,
					top,
					bottom,
				}),
			};
		}
		case "top-right": {
			const nodePointPosition: Point = {
				x: vertice.x + offsetDistance,
				y: vertice.y - offsetDistance,
			};
			return {
				position: nodePointPosition,
				correct: !isPointIntersectsRect({
					point: nodePointPosition,
					left,
					right,
					top,
					bottom,
				}),
			};
		}
		case "top-left": {
			const nodePointPosition: Point = {
				x: vertice.x - offsetDistance,
				y: vertice.y - offsetDistance,
			};
			return {
				position: nodePointPosition,
				correct: !isPointIntersectsRect({
					point: nodePointPosition,
					left,
					right,
					top,
					bottom,
				}),
			};
		}
		case "bottom-left": {
			const nodePointPosition: Point = {
				x: vertice.x - offsetDistance,
				y: vertice.y + offsetDistance,
			};
			return {
				position: nodePointPosition,
				correct: !isPointIntersectsRect({
					point: nodePointPosition,
					left,
					right,
					top,
					bottom,
				}),
			};
		}
	}
};

const offsetVertice = (
	vertice: Point,
	offsetX: number,
	offsetY: number
): Point => {
	return { x: vertice.x + offsetX, y: vertice.y + offsetY };
};

const getRectangularsOffsettedEdges = ({
	rectangulars,
	offset,
}: {
	rectangulars: Rect[];
	offset: number;
}): RectEdge[] => {
	const offsetDecreased = offset - 1;

	return rectangulars
		.map((rect, index) => {
			const vertices = getRectangularVertices(rect);

			return [
				{
					vertices: [
						offsetVertice(vertices[0], offsetDecreased, offsetDecreased),
						offsetVertice(vertices[1], offsetDecreased, -offsetDecreased),
					] as [Point, Point],
					extrudedVertices: [
						offsetVertice(vertices[0], offset, offset),
						offsetVertice(vertices[1], offset, -offset),
					] as [Point, Point],
					nodePoints: [
						getNodePointFromVertice({
							vertice: vertices[0],
							alignment: "bottom-right",
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
						getNodePointFromVertice({
							vertice: vertices[1],
							alignment: "top-right",
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
					] as [NodePoint, NodePoint],
					normal: 90 as AlignmentNormal,
					id: Symbol("id"),
				},
				{
					vertices: [
						offsetVertice(vertices[1], offsetDecreased, -offsetDecreased),
						offsetVertice(vertices[2], -offsetDecreased, -offsetDecreased),
					] as [Point, Point],
					extrudedVertices: [
						offsetVertice(vertices[1], offset, -offset),
						offsetVertice(vertices[2], -offset, -offset),
					] as [Point, Point],
					nodePoints: [
						getNodePointFromVertice({
							vertice: vertices[1],
							alignment: "top-right",
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
						getNodePointFromVertice({
							vertice: vertices[2],
							alignment: "top-left",
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
					] as [NodePoint, NodePoint],
					normal: 180 as AlignmentNormal,
					id: Symbol("id"),
				},
				{
					vertices: [
						offsetVertice(vertices[2], -offsetDecreased, -offsetDecreased),
						offsetVertice(vertices[3], -offsetDecreased, offsetDecreased),
					] as [Point, Point],
					extrudedVertices: [
						offsetVertice(vertices[2], -offset, -offset),
						offsetVertice(vertices[3], -offset, offset),
					] as [Point, Point],
					nodePoints: [
						getNodePointFromVertice({
							vertice: vertices[2],
							alignment: "top-left",
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
						getNodePointFromVertice({
							vertice: vertices[3],
							alignment: "bottom-left",
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
					] as [NodePoint, NodePoint],
					normal: 270 as AlignmentNormal,
					id: Symbol("id"),
				},
				{
					vertices: [
						offsetVertice(vertices[3], -offsetDecreased, offsetDecreased),
						offsetVertice(vertices[0], offsetDecreased, offsetDecreased),
					] as [Point, Point],
					extrudedVertices: [
						offsetVertice(vertices[3], -offset, offset),
						offsetVertice(vertices[0], offset, offset),
					] as [Point, Point],
					nodePoints: [
						getNodePointFromVertice({
							vertice: vertices[3],
							alignment: "bottom-left",
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
						getNodePointFromVertice({
							vertice: vertices[0],
							alignment: "bottom-right",
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
					] as [NodePoint, NodePoint],
					normal: 0 as AlignmentNormal,
					id: Symbol("id"),
				},
			];
		})
		.flat();
};

const heuristicPathSearch = ({
	start,
	end,
	allEdges,
}: {
	start: Point;
	end: Point;
	allEdges: RectEdge[];
}): Point[] => {
	const pathTree: PathNode = new PathNode({
		currentBestSolution: { distance: null, nodePoints: [] },
		allEdges,
		finalTarget: { position: end, correct: true },
		nodePoint: { position: start, correct: true },
		parent: null,
	});

	return pathTree.currentBestSolution.nodePoints.map(
		(nodePoint) => nodePoint.position as Point
	);
};

export const dataConverter = (
	rect1: Rect,
	rect2: Rect,
	cPoint1: ConnectionPoint,
	cPoint2: ConnectionPoint
): Point[] | RuntimeException => {
	const cPoint1WithOffset = getConnectionPointOffsetted({
		cPoint: cPoint1,
		offset: offsetDistance,
	});
	const cPoint2WithOffset = getConnectionPointOffsetted({
		cPoint: cPoint2,
		offset: offsetDistance,
	});

	const allEdges = getRectangularsOffsettedEdges({
		rectangulars: [rect1, rect2],
		offset: offsetDistance,
	});

	if (cPoint1WithOffset === null || cPoint2WithOffset === null) {
		return new RuntimeException(
			"One of the connection points does not perpendicular to its edge."
		);
	} else {
		const path = heuristicPathSearch({
			start: cPoint1WithOffset,
			end: cPoint2WithOffset,
			allEdges,
		});
		path.push(cPoint1.point);
		path.unshift(cPoint2.point);

		return path;
	}
};
