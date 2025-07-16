import PathSolution from "../types/PathSolution.type";
import RectEdge from "../types/RectEdge.type";
import { getAvailablePointNodes } from "../utils/getAvailablePointNodes";
import {
	raycastDistanceMeasure,
	raycastIsIntersectingByAnyEdge,
} from "../utils/raycast";
import PointNode from "./PointNode.class";

type ProccessStatus = "ongoing" | "aborted";

class PathNode {
	currentBestSolution: PathSolution;
	allEdges: RectEdge[];

	processing: ProccessStatus;
	pointNode: PointNode;

	parent: PathNode | null;
	segmentLength: number;
	children: PathNode[];

	#finalTarget: PointNode;
	distanceToFinalTarget: number;

	availablePointNodes: PointNode[] | null;

	constructor(constructBody: {
		currentBestSolution: PathSolution;
		allEdges: RectEdge[];
		pointNode: PointNode;
		parent: PathNode | null;
		finalTarget: PointNode;
	}) {
		this.currentBestSolution = constructBody.currentBestSolution;
		this.allEdges = constructBody.allEdges;

		this.pointNode = constructBody.pointNode;

		this.parent = constructBody.parent;

		if (this.parent === null) {
			this.segmentLength = 0;
		} else {
			this.segmentLength = raycastDistanceMeasure(
				constructBody.pointNode.position,
				this.parent.pointNode.position
			);
		}

		if (constructBody.currentBestSolution.distance === null) {
			this.processing = "ongoing";
		} else {
			const segmentsLengthArray: number[] = [];
			this.collectSegmentsLength(segmentsLengthArray);

			let currentPathLength = 0;
			segmentsLengthArray.forEach((segment) => {
				currentPathLength += segment;
			});

			this.processing =
				raycastDistanceMeasure(
					constructBody.pointNode.position,
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
			constructBody.pointNode.position,
			constructBody.finalTarget.position
		);

		this.availablePointNodes = null;

		const isTargetSeenClearfully: boolean = !raycastIsIntersectingByAnyEdge({
			ray: {
				start: this.pointNode.position,
				end: this.#finalTarget.position,
			},
			edges: this.allEdges,
		});

		if (isTargetSeenClearfully) {
			const path: PointNode[] = [];
			path.push(this.#finalTarget);
			path.push(this.pointNode);
			this.collectPathFromParentRecursive(path);

			const segmentsLengthArray: number[] = [];
			segmentsLengthArray.push(
				raycastDistanceMeasure(
					this.pointNode.position,
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
					pointNodes: path,
					distance: currentPathLength,
				};
				this.updateBestResultToTheRoot(this.currentBestSolution);
			} else if (this.currentBestSolution.distance > currentPathLength) {
				this.currentBestSolution = {
					pointNodes: path,
					distance: currentPathLength,
				};
				this.updateBestResultToTheRoot(this.currentBestSolution);
			}
		} else {
			this.#reconstructChildren();
		}
	}

	collectPathFromParentRecursive(pathCollector: PointNode[]) {
		if (this.parent) {
			pathCollector.push(this.parent.pointNode);
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

	collectUsedPointNodes(pointNodesCollector: PointNode[]) {
		if (this.parent) {
			pointNodesCollector.push(this.parent.pointNode);
			this.parent.collectUsedPointNodes(pointNodesCollector);
		}
	}

	#reconstructChildren() {
		if (this.processing === "ongoing") {
			const usedPointNodes: PointNode[] = [];
			usedPointNodes.push(this.pointNode);
			this.collectUsedPointNodes(usedPointNodes);

			this.availablePointNodes = getAvailablePointNodes({
				ray: {
					start: this.pointNode.position,
					end: this.#finalTarget.position,
				},
				allEdges: this.allEdges,
				usedPointNodes,
			});
		}

		if (this.availablePointNodes) {
			this.availablePointNodes.forEach((pointNode) => {
				this.children.push(
					new PathNode({
						currentBestSolution: this.currentBestSolution,
						allEdges: this.allEdges,
						finalTarget: this.#finalTarget,
						pointNode,
						parent: this,
					})
				);
			});
		}
	}
}

export default PathNode;
