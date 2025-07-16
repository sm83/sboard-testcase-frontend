import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";

export const isPointIntersectsRect = ({
	point,
	left,
	right,
	top,
	bottom,
}: {
	point: Point;
	left: number;
	right: number;
	top: number;
	bottom: number;
}): boolean => {
	const result =
		point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;

	return result;
};
