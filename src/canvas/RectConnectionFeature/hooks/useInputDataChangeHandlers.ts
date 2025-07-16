import { Dispatch, SetStateAction, useCallback } from "react";
import { Rect } from "../types/Rect.type";
import { getRectBoundingAxes } from "@/lib/getRectBoundingAxes";
import { isPointIntersectsRect } from "@/lib/isPointIntersectsRect";
import { Size } from "../types/Size.type";
import { Point } from "../types/Point.type";
import { ConnectionPoint } from "../types/ConnectionPoint.type";
import getEnlargeDirection from "@/lib/getEnlargeDirection";
import { getRelativeOrientation } from "@/lib/getRelativeOrientation";

export interface ConnectionPointPositionChangeParams {
	index: number;
	newPosition: Point;
}

export interface ConnectionPointAngleChangeParams {
	index: number;
	newAngle: number;
}

export interface RectangularPositionChangeParams {
	index: number;
	newPosition: Point;
}

export interface RectangularSizeChangeParams {
	index: number;
	newSize: Size;
}

const useInputDataChangeHandlers = ({
	rectangulars,
	setRectangulars,
	connectionPoints,
	setConnectionPoints,
}: {
	rectangulars: [Rect, Rect];
	setRectangulars: Dispatch<SetStateAction<[Rect, Rect]>>;
	connectionPoints: [ConnectionPoint, ConnectionPoint];
	setConnectionPoints: Dispatch<
		SetStateAction<[ConnectionPoint, ConnectionPoint]>
	>;
}) => {
	const handleConnectionPointPositionChange = useCallback(
		({ index, newPosition }: ConnectionPointPositionChangeParams): void => {
			setConnectionPoints((prev) => {
				const connectionPoints = [...prev] as [
					ConnectionPoint,
					ConnectionPoint
				];

				connectionPoints[index].point = newPosition;

				return connectionPoints;
			});
		},
		[setConnectionPoints]
	);

	const handleConnectionPointAngleChange = useCallback(
		({ index, newAngle }: ConnectionPointAngleChangeParams): void => {
			setConnectionPoints((prev) => {
				const connectionPoints = [...prev] as [
					ConnectionPoint,
					ConnectionPoint
				];

				connectionPoints[index].angle = newAngle;

				return connectionPoints;
			});
		},
		[setConnectionPoints]
	);

	const handleRectangularPositionChange = useCallback(
		({ index, newPosition }: RectangularPositionChangeParams): void => {
			{
				const [left, right, top, bottom] = getRectBoundingAxes({
					rect: rectangulars[index],
				});
				const connectionPoint = connectionPoints[index];

				if (
					isPointIntersectsRect({
						point: connectionPoint.point,
						left,
						right,
						top,
						bottom,
					})
				) {
					const xOffset = newPosition.x - rectangulars[index].position.x;
					const yOffset = newPosition.y - rectangulars[index].position.y;

					handleConnectionPointPositionChange({
						index,
						newPosition: {
							x: connectionPoint.point.x + xOffset,
							y: connectionPoint.point.y + yOffset,
						},
					});
				}
			}

			setRectangulars((prev) => {
				const newRectangulars = [...prev] as [Rect, Rect];

				newRectangulars[index].position = newPosition;

				return newRectangulars;
			});
		},
		[
			connectionPoints,
			handleConnectionPointPositionChange,
			rectangulars,
			setRectangulars,
		]
	);

	const handleRectangularSizeChange = useCallback(
		({ index, newSize }: RectangularSizeChangeParams): void => {
			{
				const [left, right, top, bottom] = getRectBoundingAxes({
					rect: rectangulars[index],
				});
				const connectionPoint = connectionPoints[index];
				const connectionPointRelativeOrientation = getRelativeOrientation(
					connectionPoint.angle
				);

				if (
					isPointIntersectsRect({
						point: connectionPoint.point,
						left,
						right,
						top,
						bottom,
					})
				) {
					const xOffset =
						((newSize.width - rectangulars[index].size.width) / 2) *
						getEnlargeDirection({
							relativeOrientation: connectionPointRelativeOrientation,
							axis: "x",
						});
					const yOffset =
						((newSize.height - rectangulars[index].size.height) / 2) *
						getEnlargeDirection({
							relativeOrientation: connectionPointRelativeOrientation,
							axis: "y",
						});

					handleConnectionPointPositionChange({
						index,
						newPosition: {
							x: connectionPoint.point.x + xOffset,
							y: connectionPoint.point.y + yOffset,
						},
					});
				}
			}

			setRectangulars((prev) => {
				const newRectangulars = [...prev] as [Rect, Rect];

				newRectangulars[index].size = newSize;

				return newRectangulars;
			});
		},
		[
			connectionPoints,
			handleConnectionPointPositionChange,
			rectangulars,
			setRectangulars,
		]
	);

	return {
		handleRectangularPositionChange,
		handleRectangularSizeChange,
		handleConnectionPointPositionChange,
		handleConnectionPointAngleChange,
	};
};

export default useInputDataChangeHandlers;
