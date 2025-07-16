import NodePoint from "../types/NodePoint.type";
import PathSolution from "../types/PathSolution.type";
import RectEdge from "../types/RectEdge.type";
import { getAvailableNodePoints } from "../utils/getAvailablePointNodes";
import {
	raycastDistanceMeasure,
	raycastIsIntersectingByAnyEdge,
} from "../utils/raycast";

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
			// segmentsLengthArray.push(this.segmentLength);
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

		const isTargetSeenClearfully: boolean = !raycastIsIntersectingByAnyEdge({
			ray: {
				start: this.nodePoint.position,
				end: this.#finalTarget.position,
			},
			edges: this.allEdges,
		});

		if (isTargetSeenClearfully) {
			const path: NodePoint[] = [];
			path.push(this.#finalTarget);
			path.push(this.nodePoint);
			this.collectPathFromParentRecursive(path);

			const segmentsLengthArray: number[] = [];
			segmentsLengthArray.push(
				raycastDistanceMeasure(
					this.nodePoint.position,
					this.#finalTarget.position
				)
			);
			this.collectSegmentsLength(segmentsLengthArray);

			let currentPathLength = 0;
			segmentsLengthArray.forEach((segment) => {
				currentPathLength += segment;
			});

			if (this.currentBestSolution.distance === null) {
				this.currentBestSolution = {
					nodePoints: path,
					distance: currentPathLength,
				};
				this.updateBestResultToTheRoot(this.currentBestSolution);
			} else if (this.currentBestSolution.distance > currentPathLength) {
				this.currentBestSolution = {
					nodePoints: path,
					distance: currentPathLength,
				};
				this.updateBestResultToTheRoot(this.currentBestSolution);
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

	updateBestResultToTheRoot(newResult: PathSolution) {
		this.currentBestSolution = newResult;
		if (this.parent) {
			this.parent.updateBestResultToTheRoot(newResult);
		}
	}

	collectSegmentsLength(segmentsLengthsCollector: number[]) {
		segmentsLengthsCollector.push(this.segmentLength);
		if (this.parent) {
			this.parent.collectSegmentsLength(segmentsLengthsCollector);
		}
	}

	collectUsedNodePoints(nodePointsCollector: NodePoint[]) {
		if (this.parent) {
			nodePointsCollector.push(this.parent.nodePoint);
			this.parent.collectUsedNodePoints(nodePointsCollector);
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

export default PathNode;
