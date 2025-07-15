// import { ConnectionPoint } from "@/canvas/RectConnectionFeature/types/ConnectionPoint.type";
import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";
import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";
import { ConnectionPoint } from "@/canvas/RectConnectionFeature/types/ConnectionPoint.type";
import { RuntimeException } from "@/canvas/RectConnectionFeature/subclasses/RuntimeException.class";
import { AlignmentNormal } from "@/canvas/RectConnectionFeature/types/AlignmentNormal.type";
import { isPointIntersectsRect } from "./isPointIntersectsRect";
import { getRectBoundingAxes } from "./getRectBoundingAxes";
import { getConnectionPointOffsetted } from "./getConnectionPointOffsetted";

export class Exception {
	error: string;

	constructor(error: string) {
		this.error = error;
	}
}

interface RectEdge {
	vertices: [Point, Point];
	nodePoints: [NodePoint, NodePoint];
	normal: AlignmentNormal;
	id: symbol;
}

interface NodePoint {
	position: Point;
	correct: boolean;
}

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

const getRectangularsEdges = ({
	rectangulars,
}: {
	rectangulars: Rect[];
}): RectEdge[] => {
	return rectangulars
		.map((rect, index) => {
			const vertices = getRectangularVertices(rect);

			return [
				{
					vertices: [vertices[0], vertices[1]] as [Point, Point],
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
					vertices: [vertices[1], vertices[2]] as [Point, Point],
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
					vertices: [vertices[2], vertices[3]] as [Point, Point],
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
					vertices: [vertices[3], vertices[0]] as [Point, Point],
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

const raycastDistanceMeasure = (point: Point, target: Point): number => {
	return Math.sqrt(
		Math.pow(point.x - target.x, 2) + Math.pow(point.y - target.y, 2)
	);
};

const raycastGetIntersectingEdges = ({
	ray,
	edges,
	returnFirstAny = false,
}: {
	ray: { start: Point; end: Point };
	edges: RectEdge[];
	returnFirstAny?: boolean;
}) => {
	const intersectingEdges: RectEdge[] = [];

	for (const edge of edges) {
		const [a1, a2] = [ray.start, ray.end];
		const [b1, b2] = edge.vertices;

		const vectorMultiplier =
			(b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

		if (vectorMultiplier === 0) continue;

		const ua =
			((b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x)) /
			vectorMultiplier;

		const ub =
			((a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x)) /
			vectorMultiplier;

		if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
			intersectingEdges.push(edge);
			if (returnFirstAny) {
				break;
			}
		}
	}

	return intersectingEdges;
};

const getAvailableNodePoints = ({
	ray,
	usedNodePoints,
	allEdges,
}: {
	ray: { start: Point; end: Point };
	usedNodePoints: NodePoint[];
	allEdges: RectEdge[];
}) => {
	// getting edges which intersects ray
	const edges = raycastGetIntersectingEdges({ ray, edges: allEdges });

	// getting all node points that intersected edges got
	const allNodePoints: NodePoint[] = edges
		.map((edge) => edge.nodePoints)
		.flat();

	// filtering those which has correct flag false
	const correctNodePoints = allNodePoints.filter(
		(nodePoint) => nodePoint.correct
	);

	// removing duplicates
	const nodePointsDuplicatesFiltered: NodePoint[] = [];
	correctNodePoints.forEach((nodePoint) => {
		if (
			!nodePointsDuplicatesFiltered.find(
				(nodePointAdded) => nodePointAdded.position === nodePoint.position
			)
		) {
			nodePointsDuplicatesFiltered.push(nodePoint);
		}
	});

	// removing already used
	const nodePointsUsedFiltered: NodePoint[] =
		nodePointsDuplicatesFiltered.filter(
			(nodePoint) => !usedNodePoints.find((np) => np === nodePoint)
		);

	// final array
	const availableNodePoints: NodePoint[] = [];
	// adding nodePoints, raycast to which doesnt blocked by any edges.
	nodePointsUsedFiltered.forEach((nodePoint) => {
		if (
			raycastGetIntersectingEdges({
				ray: { start: ray.start, end: nodePoint.position },
				edges: allEdges,
				returnFirstAny: true,
			}).length === 0
		) {
			availableNodePoints.push(nodePoint);
		}
	});

	return availableNodePoints;
};

interface PathSolution {
	distance: null | number;
	nodePoints: NodePoint[];
}

type ProccessStatus = "ongoing" | "aborted";

class PathNode {
	currentBestSolution: PathSolution;
	allEdges: RectEdge[];

	processing: ProccessStatus;
	nodePoint: NodePoint;

	parent: PathNode | null;
	segmentLength: number;
	children: PathNode[];

	#finalTarget: NodePoint;
	distanceToFinalTarget: number;

	availableNodePoints: NodePoint[] | null;

	constructor(constructBody: {
		currentBestSolution: PathSolution;
		allEdges: RectEdge[];
		nodePoint: NodePoint;
		parent: PathNode | null;
		finalTarget: NodePoint;
	}) {
		this.currentBestSolution = constructBody.currentBestSolution;
		this.allEdges = constructBody.allEdges;

		this.nodePoint = constructBody.nodePoint;

		this.parent = constructBody.parent;

		if (this.parent === null) {
			this.segmentLength = 0;
		} else {
			this.segmentLength = raycastDistanceMeasure(
				constructBody.nodePoint.position,
				this.parent.nodePoint.position
			);
		}

		if (constructBody.currentBestSolution.distance === null) {
			this.processing = "ongoing";
		} else {
			const segmentsLengthArray: number[] = [];
			segmentsLengthArray.push(this.segmentLength);
			this.collectSegmentsLength(segmentsLengthArray);

			let currentPathLength = 0;
			segmentsLengthArray.forEach((segment) => {
				currentPathLength += segment;
			});

			this.processing =
				raycastDistanceMeasure(
					constructBody.nodePoint.position,
					constructBody.finalTarget.position
				) +
					currentPathLength >
				constructBody.currentBestSolution.distance
					? "aborted"
					: "ongoing";
		}

		this.children = [];

		this.#finalTarget = constructBody.finalTarget;
		this.distanceToFinalTarget = raycastDistanceMeasure(
			constructBody.nodePoint.position,
			constructBody.finalTarget.position
		);

		this.availableNodePoints = null;

		const isTargetSeenClearfully: boolean =
			raycastGetIntersectingEdges({
				ray: {
					start: this.nodePoint.position,
					end: this.#finalTarget.position,
				},
				edges: this.allEdges,
				returnFirstAny: true,
			}).length === 0;

		if (isTargetSeenClearfully) {
			const path: NodePoint[] = [];
			path.push(this.#finalTarget);
			path.push(this.nodePoint);
			this.collectPathFromParentRecursive(path);

			let pathLength = raycastDistanceMeasure(
				this.nodePoint.position,
				this.#finalTarget.position
			);
			for (let i = 0; i < path.length - 1; i++) {
				pathLength += raycastDistanceMeasure(
					path[i].position,
					path[i + 1].position
				);
			}

			if (this.currentBestSolution.distance === null) {
				this.currentBestSolution = { nodePoints: path, distance: pathLength };
				this.updateBestResultToTheTree(this.currentBestSolution);
			} else if (this.currentBestSolution.distance > pathLength) {
				this.currentBestSolution = { nodePoints: path, distance: pathLength };
				this.updateBestResultToTheTree(this.currentBestSolution);
			}
		} else {
			this.#reconstructChildren();
		}
	}

	collectPathFromParentRecursive(pathCollector: NodePoint[]) {
		if (this.parent) {
			pathCollector.push(this.parent.nodePoint);
			this.parent.collectPathFromParentRecursive(pathCollector);
		}
	}

	updateBestResultToTheTree(newResult: PathSolution) {
		this.currentBestSolution = newResult;
		if (this.parent) {
			this.parent.updateBestResultToTheTree(newResult);
		}
	}

	collectSegmentsLength(segmentsLengthsCollector: number[]) {
		if (this.parent) {
			segmentsLengthsCollector.push(this.parent.segmentLength);
		}
	}

	collectUsedNodePoints(nodePointsCollector: NodePoint[]) {
		if (this.parent) {
			nodePointsCollector.push(this.parent.nodePoint);
		}
	}

	#reconstructChildren() {
		if (this.processing === "ongoing") {
			const usedNodePoints: NodePoint[] = [];
			usedNodePoints.push(this.nodePoint);
			this.collectUsedNodePoints(usedNodePoints);

			this.availableNodePoints = getAvailableNodePoints({
				ray: {
					start: this.nodePoint.position,
					end: this.#finalTarget.position,
				},
				allEdges: this.allEdges,
				usedNodePoints,
			});
		}

		if (this.availableNodePoints) {
			this.availableNodePoints.forEach((nodePoint) => {
				this.children.push(
					new PathNode({
						currentBestSolution: this.currentBestSolution,
						allEdges: this.allEdges,
						finalTarget: this.#finalTarget,
						nodePoint,
						parent: this,
					})
				);
			});
		}
	}
}

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

// TODO: apply correct props format
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

	const allEdges = getRectangularsEdges({ rectangulars: [rect1, rect2] });

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
