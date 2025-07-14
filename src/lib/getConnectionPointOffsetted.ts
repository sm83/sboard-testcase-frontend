import { AlignmentNormal } from "@/canvas/RectConnectionFeature/types/AlignmentNormal.type";
import { ConnectionPoint } from "@/canvas/RectConnectionFeature/types/ConnectionPoint.type";
import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";

export const getConnectionPointOffsetted = ({
	cPoint,
	offset = 0,
}: {
	cPoint: ConnectionPoint;
	offset?: number;
}): Point | null => {
	const angle = cPoint.angle as AlignmentNormal;

	switch (angle) {
		case 0:
			return { x: cPoint.point.x, y: cPoint.point.y + offset };
		case 90:
			return { x: cPoint.point.x + offset, y: cPoint.point.y };
		case 180:
			return { x: cPoint.point.x, y: cPoint.point.y - offset };
		case 270:
			return { x: cPoint.point.x - offset, y: cPoint.point.y };
		default:
			return null;
	}
};
