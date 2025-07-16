import PointNode from "../subclassesUtils/PointNode.class";
import { Point } from "../types/Point.type";
import RectEdge from "../types/RectEdge.type";
import { raycastIsIntersectingByAnyEdge } from "./raycast";

export const getAvailablePointNodes = ({
	ray,
	usedPointNodes,
	allEdges,
}: {
	ray: { start: Point; end: Point };
	usedPointNodes: PointNode[];
	allEdges: RectEdge[];
}) => {
	// getting all node points that intersected edges got
	const allPointNodes: PointNode[] = allEdges
		.map((edge) => edge.pointNodes)
		.flat();

	// filtering those which has correct flag false
	const correctPointNodes = allPointNodes.filter(
		(pointNode) => pointNode.correct
	);

	// removing duplicates
	const pointNodesDuplicatesFiltered: PointNode[] = [];
	correctPointNodes.forEach((pointNode) => {
		if (
			!pointNodesDuplicatesFiltered.find((pointNodeAdded) => {
				return (
					pointNodeAdded.position.x === pointNode.position.x &&
					pointNodeAdded.position.y === pointNode.position.y
				);
			})
		) {
			pointNodesDuplicatesFiltered.push(pointNode);
		}
	});

	// removing already used
	const pointNodesUsedFiltered: PointNode[] = [];
	pointNodesDuplicatesFiltered.forEach((pointNode) => {
		if (
			!usedPointNodes.find((usedPointNode) => {
				return (
					usedPointNode.position.x === pointNode.position.x &&
					usedPointNode.position.y === pointNode.position.y
				);
			})
		) {
			pointNodesUsedFiltered.push(pointNode);
		}
	});

	// final array
	const availablePointNodes: PointNode[] = [];
	// adding pointNodes, raycast to which doesnt blocked by any edges.
	pointNodesUsedFiltered.forEach((pointNode) => {
		if (
			!raycastIsIntersectingByAnyEdge({
				ray: { start: ray.start, end: pointNode.position },
				edges: allEdges,
			})
		) {
			availablePointNodes.push(pointNode);
		}
	});

	return availablePointNodes;
};
