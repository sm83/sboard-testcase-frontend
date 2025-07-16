import { Point } from "../types/Point.type";
import { Rect } from "../types/Rect.type";

export const getRectangularVertices = (
	rect: Rect
): [Point, Point, Point, Point] => {
	return [
		// bottom-right
		{
			x: rect.position.x + rect.size.width / 2,
			y: rect.position.y + rect.size.height / 2,
		},
		// top-right
		{
			x: rect.position.x + rect.size.width / 2,
			y: rect.position.y - rect.size.height / 2,
		},
		// top-left
		{
			x: rect.position.x - rect.size.width / 2,
			y: rect.position.y - rect.size.height / 2,
		},
		// bottom-left
		{
			x: rect.position.x - rect.size.width / 2,
			y: rect.position.y + rect.size.height / 2,
		},
	];
};
