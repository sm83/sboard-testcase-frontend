import NodePoint from "../types/NodePoint.type";
import { Point } from "../types/Point.type";
import RectEdge from "../types/RectEdge.type";
import { raycastIsIntersectingByAnyEdge } from "./raycast";

export const getAvailableNodePoints = ({
	ray,
	usedNodePoints,
	allEdges,
}: {
	ray: { start: Point; end: Point };
	usedNodePoints: NodePoint[];
	allEdges: RectEdge[];
}) => {
	// getting all node points that intersected edges got
	const allNodePoints: NodePoint[] = allEdges
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
			!nodePointsDuplicatesFiltered.find((nodePointAdded) => {
				return (
					nodePointAdded.position.x === nodePoint.position.x &&
					nodePointAdded.position.y === nodePoint.position.y
				);
			})
		) {
			nodePointsDuplicatesFiltered.push(nodePoint);
		}
	});

	// removing already used
	const nodePointsUsedFiltered: NodePoint[] = [];
	nodePointsDuplicatesFiltered.forEach((nodePoint) => {
		if (
			!usedNodePoints.find((usedNodePoint) => {
				return (
					usedNodePoint.position.x === nodePoint.position.x &&
					usedNodePoint.position.y === nodePoint.position.y
				);
			})
		) {
			nodePointsUsedFiltered.push(nodePoint);
		}
	});

	// final array
	const availableNodePoints: NodePoint[] = [];
	// adding nodePoints, raycast to which doesnt blocked by any edges.
	nodePointsUsedFiltered.forEach((nodePoint) => {
		if (
			!raycastIsIntersectingByAnyEdge({
				ray: { start: ray.start, end: nodePoint.position },
				edges: allEdges,
			})
		) {
			availableNodePoints.push(nodePoint);
		}
	});

	return availableNodePoints;
};
