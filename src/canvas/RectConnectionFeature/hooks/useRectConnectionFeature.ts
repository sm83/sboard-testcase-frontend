import { ChangeEvent, RefObject, useCallback } from "react";
import { Point } from "../types/Point.type";
import { Size } from "../types/Size.type";
import { RectConnectionFeatureRef } from "../RectConnectionFeature";
import { Rect } from "../types/Rect.type";
import { ConnectionPoint } from "../types/ConnectionPoint.type";

const useRectConnectionFeature = ({
	rectConnectionFeatureRef,
	rectangulars,
	connectionPoints,
}: {
	rectConnectionFeatureRef: RefObject<RectConnectionFeatureRef | null>;
	rectangulars: [Rect, Rect];
	connectionPoints: [ConnectionPoint, ConnectionPoint];
}) => {
	// attention: it uses method which was forwarded from child component <RectConnectionFeature />
	const handleRectangularPositionChange = useCallback(
		({
			e,
			field,
			index,
		}: {
			e: ChangeEvent<HTMLInputElement>;
			field: keyof Point;
			index: number;
		}) => {
			if (rectConnectionFeatureRef.current) {
				rectConnectionFeatureRef.current.handleRectangularPositionChange({
					index,
					newPosition: {
						...rectangulars[index].position,
						[field]: +e.target.value,
					},
				});
			}
		},
		[rectConnectionFeatureRef, rectangulars]
	);

	// attention: it uses method which was forwarded from child component <RectConnectionFeature />
	const handleRectangularSizeChange = useCallback(
		({
			e,
			field,
			index,
		}: {
			e: ChangeEvent<HTMLInputElement>;
			field: keyof Size;
			index: number;
		}) => {
			if (rectConnectionFeatureRef.current) {
				rectConnectionFeatureRef.current.handleRectangularSizeChange({
					index,
					newSize: {
						...rectangulars[index].size,
						[field]: +e.target.value,
					},
				});
			}
		},
		[rectConnectionFeatureRef, rectangulars]
	);

	// attention: it uses method which was forwarded from child component <RectConnectionFeature />
	const handleConnectionPointPositionChange = useCallback(
		({
			e,
			field,
			index,
		}: {
			e: ChangeEvent<HTMLInputElement>;
			field: keyof Point;
			index: number;
		}) => {
			if (rectConnectionFeatureRef.current) {
				rectConnectionFeatureRef.current.handleConnectionPointPositionChange({
					index,
					newPosition: {
						...connectionPoints[index].point,
						[field]: +e.target.value,
					},
				});
			}
		},
		[connectionPoints, rectConnectionFeatureRef]
	);

	// attention: it uses method which was forwarded from child component <RectConnectionFeature />
	const handleConnectionPointAngleChange = useCallback(
		({ e, index }: { e: ChangeEvent<HTMLInputElement>; index: number }) => {
			if (rectConnectionFeatureRef.current) {
				rectConnectionFeatureRef.current.handleConnectionPointAngleChange({
					index,
					newAngle: +e.target.value,
				});
			}
		},
		[rectConnectionFeatureRef]
	);

	return {
		handleRectangularPositionChange,
		handleRectangularSizeChange,
		handleConnectionPointPositionChange,
		handleConnectionPointAngleChange,
	};
};

export default useRectConnectionFeature;
