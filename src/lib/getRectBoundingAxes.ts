import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";

export const getRectBoundingAxes = ({
	rect,
	offset = 0,
}: {
	rect: Rect;
	offset?: number;
}): [number, number, number, number] => {
	const [left, right, top, bottom] = [
		rect.position.x - rect.size.width / 2 - offset,
		rect.position.x + rect.size.width / 2 + offset,
		rect.position.y - rect.size.height / 2 - offset,
		rect.position.y + rect.size.height / 2 + offset,
	];

	return [left, right, top, bottom];
};
