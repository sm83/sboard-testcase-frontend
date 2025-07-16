import { Point } from "../types/Point.type";

export const getOffsetVertice = (
	vertice: Point,
	offsetX: number,
	offsetY: number
): Point => {
	return { x: vertice.x + offsetX, y: vertice.y + offsetY };
};
