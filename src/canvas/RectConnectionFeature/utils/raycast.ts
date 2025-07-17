import isPointOnSegment from "@/lib/isPointOnSegment";
import { Point } from "../types/Point.type";
import RectEdge from "../types/RectEdge.type";

export const raycastCheckIntersection = ({
	ray,
	edge,
	useExtruded = false,
}: {
	ray: { start: Point; end: Point };
	edge: RectEdge;
	useExtruded?: boolean;
}) => {
	const [a1, a2] = [ray.start, ray.end];
	const [b1, b2] = useExtruded ? edge.extrudedVertices : edge.vertices;

	if (
		isPointOnSegment({ vertice1: a1, vertice2: a2, targetVertice: b1 }) ||
		isPointOnSegment({ vertice1: a1, vertice2: a2, targetVertice: b2 }) ||
		isPointOnSegment({ vertice1: b1, vertice2: b2, targetVertice: a1 }) ||
		isPointOnSegment({ vertice1: b1, vertice2: b2, targetVertice: a2 })
	) {
		return true;
	}

	const vectorMultiplier =
		(b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

	if (vectorMultiplier === 0) {
		return false;
	}

	const ua =
		((b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x)) /
		vectorMultiplier;

	const ub =
		((a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x)) /
		vectorMultiplier;

	if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
		return true;
	}

	return false;
};

export const raycastDistanceMeasure = (point: Point, target: Point): number => {
	return Math.sqrt(
		Math.pow(point.x - target.x, 2) + Math.pow(point.y - target.y, 2)
	);
};

export const raycastIsIntersectingByAnyEdge = ({
	ray,
	edges,
}: {
	ray: { start: Point; end: Point };
	edges: RectEdge[];
}): boolean => {
	for (const edge of edges) {
		const checkResult = raycastCheckIntersection({
			ray,
			edge,
		});

		if (checkResult) {
			return true;
		}
	}

	return false;
};
