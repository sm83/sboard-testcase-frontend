import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";

type IntersectionCheckResult = "intersection" | "no intersection";

// Axis-Aligned Bounding Box
export const checkIntersection = ({
	rect1,
	rect2,
	offsetDistance,
}: {
	rect1: Rect;
	rect2: Rect;
	offsetDistance: number;
}): IntersectionCheckResult => {
	const left1 = rect1.position.x - rect1.size.width / 2 - offsetDistance;
	const right1 = rect1.position.x + rect1.size.width / 2 + offsetDistance;
	const top1 = rect1.position.y - rect1.size.height / 2 - offsetDistance;
	const bottom1 = rect1.position.y + rect1.size.height / 2 + offsetDistance;

	const left2 = rect2.position.x - rect2.size.width / 2 - offsetDistance;
	const right2 = rect2.position.x + rect2.size.width / 2 + offsetDistance;
	const top2 = rect2.position.y - rect2.size.height / 2 - offsetDistance;
	const bottom2 = rect2.position.y + rect2.size.height / 2 + offsetDistance;

	return right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2
		? "no intersection"
		: "intersection";
};

// TODO: remove in the end.

// export const checkIntersection = ({
// 	rect1,
// 	rect2,
// 	offsetDistance,
// }: {
// 	rect1: Rect;
// 	rect2: Rect;
// 	offsetDistance: number;
// }): IntersectionCheckResult | undefined => {
// 	if (
// 		rect1.position.x === rect2.position.x &&
// 		rect1.position.y === rect2.position.y
// 	) {
// 		return "intersection";
// 	}

// 	const relativeX = rect2.position.x - rect1.position.x;
// 	const relativeY = rect2.position.y - rect1.position.y;

// 	const absoluteAngle = (Math.atan(relativeY / relativeX) / Math.PI) * 180;

// 	const relativeAngle: number =
// 		relativeX >= 0 ? 90 - absoluteAngle : 270 - absoluteAngle;

// 	const relativeOrientation = getRelativeOrientation(relativeAngle);

// 	switch (relativeOrientation) {
// 		case "bottom-left": {
// 			const checkVertice1: Point = {
// 				x: rect1.position.x - rect1.size.width / 2 - offsetDistance,
// 				y: rect1.position.y + rect1.size.height / 2 + offsetDistance,
// 			};
// 			const checkVertice2: Point = {
// 				x: rect2.position.x + rect2.size.width / 2 + offsetDistance,
// 				y: rect2.position.y - rect2.size.height / 2 - offsetDistance,
// 			};
// 			if (
// 				checkVertice1.x <= checkVertice2.x &&
// 				checkVertice1.y >= checkVertice2.y
// 			) {
// 				return "intersection";
// 			}

// 			return "no intersection";
// 		}
// 		case "bottom": {
// 			const checkEdgeY1 =
// 				rect1.position.y + rect1.size.height / 2 - offsetDistance;
// 			const checkEdgeY2 =
// 				rect2.position.y - rect2.size.height / 2 + offsetDistance;

// 			if (checkEdgeY1 >= checkEdgeY2) {
// 				return "intersection";
// 			}

// 			return "no intersection";
// 		}
// 		case "bottom-right": {
// 			const checkVertice1: Point = {
// 				x: rect1.position.x + rect1.size.width / 2 + offsetDistance,
// 				y: rect1.position.y + rect1.size.height / 2 + offsetDistance,
// 			};
// 			const checkVertice2: Point = {
// 				x: rect2.position.x - rect2.size.width / 2 - offsetDistance,
// 				y: rect2.position.y - rect2.size.height / 2 - offsetDistance,
// 			};

// 			if (
// 				checkVertice1.x >= checkVertice2.x &&
// 				checkVertice1.y >= checkVertice2.y
// 			) {
// 				return "intersection";
// 			}

// 			return "no intersection";
// 		}
// 		case "right": {
// 			const checkEdgeX1 =
// 				rect1.position.x + rect1.size.width / 2 + offsetDistance;
// 			const checkEdgeX2 =
// 				rect2.position.x - rect2.size.width / 2 - offsetDistance;

// 			if (checkEdgeX1 >= checkEdgeX2) {
// 				return "intersection";
// 			}

// 			return "no intersection";
// 		}
// 		case "top-right": {
// 			const checkVertice1: Point = {
// 				x: rect1.position.x + rect1.size.width / 2 + offsetDistance,
// 				y: rect1.position.y - rect1.size.height / 2 - offsetDistance,
// 			};
// 			const checkVertice2: Point = {
// 				x: rect2.position.x - rect2.size.width / 2 - offsetDistance,
// 				y: rect2.position.y + rect2.size.height / 2 + offsetDistance,
// 			};

// 			if (
// 				checkVertice1.x >= checkVertice2.x &&
// 				checkVertice1.y <= checkVertice2.y
// 			) {
// 				return "intersection";
// 			}

// 			return "no intersection";
// 		}
// 		case "top": {
// 			const checkEdgeY1 =
// 				rect1.position.y - rect1.size.height / 2 - offsetDistance;
// 			const checkEdgeY2 =
// 				rect2.position.y + rect2.size.height / 2 + offsetDistance;

// 			if (checkEdgeY1 <= checkEdgeY2) {
// 				return "intersection";
// 			}

// 			return "no intersection";
// 		}
// 		case "top-left": {
// 			const checkVertice1: Point = {
// 				x: rect1.position.x - rect1.size.width / 2 - offsetDistance,
// 				y: rect1.position.y - rect1.size.height / 2 - offsetDistance,
// 			};
// 			const checkVertice2: Point = {
// 				x: rect2.position.x + rect2.size.width / 2 + offsetDistance,
// 				y: rect2.position.y + rect2.size.height / 2 + offsetDistance,
// 			};

// 			if (
// 				checkVertice1.x <= checkVertice2.x &&
// 				checkVertice1.y <= checkVertice2.y
// 			) {
// 				return "intersection";
// 			}

// 			return "no intersection";
// 		}
// 		case "left": {
// 			const checkEdgeX1 =
// 				rect1.position.x - rect1.size.width / 2 - offsetDistance;
// 			const checkEdgeX2 =
// 				rect2.position.x + rect2.size.width / 2 + offsetDistance;

// 			if (checkEdgeX1 <= checkEdgeX2) {
// 				return "intersection";
// 			}

// 			return "no intersection";
// 		}
// 		default:
// 			break;
// 	}
// };
