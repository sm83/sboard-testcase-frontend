import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";
import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";
import { ConnectionPoint } from "@/canvas/RectConnectionFeature/types/ConnectionPoint.type";
import { RuntimeException } from "@/canvas/RectConnectionFeature/subclassesUtils/RuntimeException.class";
import { AlignmentNormal } from "@/canvas/RectConnectionFeature/types/AlignmentNormal.type";
import RectEdge from "../types/RectEdge.type";
import PathNode from "../subclassesUtils/PathNode.class";
import PointNode from "../subclassesUtils/PointNode.class";

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
					pointNodes: [
						new PointNode({
							vertice: vertices[0],
							alignment: "bottom-right",
							offsetDistance: offset,
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
						new PointNode({
							vertice: vertices[1],
							alignment: "top-right",
							offsetDistance: offset,
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
					] as [PointNode, PointNode],
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
					pointNodes: [
						new PointNode({
							vertice: vertices[1],
							alignment: "top-right",
							offsetDistance: offset,
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
						new PointNode({
							vertice: vertices[2],
							alignment: "top-left",
							offsetDistance: offset,
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
					] as [PointNode, PointNode],
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
					pointNodes: [
						new PointNode({
							vertice: vertices[2],
							alignment: "top-left",
							offsetDistance: offset,
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
						new PointNode({
							vertice: vertices[3],
							alignment: "bottom-left",
							offsetDistance: offset,
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
					] as [PointNode, PointNode],
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
					pointNodes: [
						new PointNode({
							vertice: vertices[3],
							alignment: "bottom-left",
							offsetDistance: offset,
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
						new PointNode({
							vertice: vertices[0],
							alignment: "bottom-right",
							offsetDistance: offset,
							otherRectangular: rectangulars[index === 0 ? 1 : 0],
						}),
					] as [PointNode, PointNode],
					normal: 0 as AlignmentNormal,
					id: Symbol("id"),
				},
			];
		})
		.flat();
};

const heuristicPathSearch = ({
	rect1,
	rect2,
	cPoint1,
	cPoint2,
	allEdges,
	logNodeTree = false,
}: {
	rect1: Rect;
	rect2: Rect;
	cPoint1: ConnectionPoint;
	cPoint2: ConnectionPoint;
	allEdges: RectEdge[];
	logNodeTree?: boolean;
}): Point[] => {
	const pathTree: PathNode = new PathNode({
		currentBestSolution: { distance: null, pointNodes: [] },
		allEdges,
		finalTarget: new PointNode({
			vertice: cPoint2.point,
			alignment: cPoint2.angle,
			offsetDistance: offsetDistance,
			otherRectangular: rect2,
		}),
		pointNode: new PointNode({
			vertice: cPoint1.point,
			alignment: cPoint1.angle,
			offsetDistance: offsetDistance,
			otherRectangular: rect1,
		}),
		parent: null,
	});

	if (logNodeTree) {
		console.log(pathTree);
	}

	return pathTree.currentBestSolution.pointNodes.map(
		(pointNode) => pointNode.position as Point
	);
};

export const dataConverter = (
	rect1: Rect,
	rect2: Rect,
	cPoint1: ConnectionPoint,
	cPoint2: ConnectionPoint,
	logNodeTree?: boolean
): Point[] | RuntimeException => {
	const allEdges = getRectangularsOffsettedEdges({
		rectangulars: [rect1, rect2],
		offset: offsetDistance,
	});

	const path = heuristicPathSearch({
		rect1,
		rect2,
		cPoint1,
		cPoint2,
		allEdges,
		logNodeTree,
	});

	path.push(cPoint1.point);
	path.unshift(cPoint2.point);

	return path;
};
