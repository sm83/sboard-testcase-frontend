// import { ConnectionPoint } from "@/canvas/RectConnectionFeature/types/ConnectionPoint.type";
import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";
import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";
import { checkIntersection } from "./checkIntersection";

export class Exception {
	error: string;

	constructor(error: string) {
		this.error = error;
	}
}

const offsetDistance = 10;

// TODO: apply correct props format
export const dataConverter = (
	rect1: Rect,
	rect2: Rect
	// cPoint1: ConnectionPoint,
	// cPoint2: ConnectionPoint
): Point[] | Exception => {
	// if (checkIntersection({ rect1, rect2, offsetDistance }) === "intersection") {
	// 	return new Exception(
	// 		"Rectangulars are intersecting or do not have minimal distance between."
	// 	);
	// }

	return [];
};
