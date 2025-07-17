import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";

const isPointOnSegment = ({
	vertice1,
	vertice2,
	targetVertice,
}: {
	vertice1: Point;
	vertice2: Point;
	targetVertice: Point;
}): boolean => {
	const epsilon = 1e-10;

	const isBetweenX =
		Math.min(vertice1.x, vertice2.x) - epsilon <= targetVertice.x &&
		targetVertice.x <= Math.max(vertice1.x, vertice2.x) + epsilon;
	const isBetweenY =
		Math.min(vertice1.y, vertice2.y) - epsilon <= targetVertice.y &&
		targetVertice.y <= Math.max(vertice1.y, vertice2.y) + epsilon;

	if (!isBetweenX || !isBetweenY) return false;

	const crossResult =
		(vertice2.x - vertice1.x) * (targetVertice.y - vertice1.y) -
		(vertice2.y - vertice1.y) * (targetVertice.x - vertice1.x);
	if (Math.abs(crossResult) > epsilon) {
		return false;
	} else {
		return true;
	}
};

export default isPointOnSegment;
