import PointNode from "../subclassesUtils/PointNode.class";
import { AlignmentNormal } from "../types/AlignmentNormal.type";
import { Point } from "../types/Point.type";
import { Rect } from "../types/Rect.type";
import RectEdge from "../types/RectEdge.type";
import { getOffsetVertice } from "./getOffsettedVertice";
import { getRectangularVertices } from "./getRectangularVertices";

export const getRectangularsOffsettedEdges = ({
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
						getOffsetVertice(vertices[0], offsetDecreased, offsetDecreased),
						getOffsetVertice(vertices[1], offsetDecreased, -offsetDecreased),
					] as [Point, Point],
					extrudedVertices: [
						getOffsetVertice(vertices[0], offset, offset),
						getOffsetVertice(vertices[1], offset, -offset),
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
						getOffsetVertice(vertices[1], offsetDecreased, -offsetDecreased),
						getOffsetVertice(vertices[2], -offsetDecreased, -offsetDecreased),
					] as [Point, Point],
					extrudedVertices: [
						getOffsetVertice(vertices[1], offset, -offset),
						getOffsetVertice(vertices[2], -offset, -offset),
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
						getOffsetVertice(vertices[2], -offsetDecreased, -offsetDecreased),
						getOffsetVertice(vertices[3], -offsetDecreased, offsetDecreased),
					] as [Point, Point],
					extrudedVertices: [
						getOffsetVertice(vertices[2], -offset, -offset),
						getOffsetVertice(vertices[3], -offset, offset),
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
						getOffsetVertice(vertices[3], -offsetDecreased, offsetDecreased),
						getOffsetVertice(vertices[0], offsetDecreased, offsetDecreased),
					] as [Point, Point],
					extrudedVertices: [
						getOffsetVertice(vertices[3], -offset, offset),
						getOffsetVertice(vertices[0], offset, offset),
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
