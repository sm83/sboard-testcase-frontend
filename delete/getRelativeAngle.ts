import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";

export const getRelativeAngle = ({
	rect1,
	rect2,
}: {
	rect1: Rect;
	rect2: Rect;
}) => {
	const relativeX = rect2.position.x - rect1.position.x;
	const relativeY = rect2.position.y - rect1.position.y;

	const absoluteAngle = (Math.atan(relativeY / relativeX) / Math.PI) * 180;

	const relativeAngle: number =
		relativeX >= 0 ? 90 - absoluteAngle : 270 - absoluteAngle;

	return relativeAngle;
};
