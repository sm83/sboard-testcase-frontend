import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";
import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";
import { ConnectionPoint } from "@/canvas/RectConnectionFeature/types/ConnectionPoint.type";
import PathNode from "../subclassesUtils/PathNode.class";
import PointNode from "../subclassesUtils/PointNode.class";

import { getRectangularsOffsettedEdges } from "./getRectangularsOffsettedEdges";

const offsetDistance = 10;

export const dataConverter = (
	rect1: Rect,
	rect2: Rect,
	cPoint1: ConnectionPoint,
	cPoint2: ConnectionPoint,
	logNodeTree?: boolean
): Point[] => {
	const allEdges = getRectangularsOffsettedEdges({
		rectangulars: [rect1, rect2],
		offset: offsetDistance,
	});

	// path tree is building using heuristic algorithm
	// you can observe tree by clicking "Run 'dataConverter'" button in interface with useDebug = true.

	// tree was built with class instances, as they can run code on contruction
	// and it's a very convenient to link instances between with parent-child links.
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

	const path = pathTree.currentBestSolution.pointNodes.map(
		(pointNode) => pointNode.position as Point
	);

	if (path.length) {
		path.push(cPoint1.point);
		path.unshift(cPoint2.point);
	}

	return path;
};
