import {
	ConnectionPointPositionChangeParams,
	RectangularPositionChangeParams,
} from "@/app/page";
import RectConnectionFeatureCanvas from "@/canvas/RectConnectionFeature/RectConnectionFeatureCanvas";
import { InitException } from "@/canvas/RectConnectionFeature/subclassesUtils/InitException.class";
import { MouseEventHandler, useCallback, useState } from "react";

interface UseRectangularDragParams {
	canvas: HTMLCanvasElement | null;
	canvasFeature: RectConnectionFeatureCanvas | null;
	handleRectangularPositionChange: ({
		index,
		newPosition,
	}: RectangularPositionChangeParams) => void;
	handleConnectionPointPositionChange: ({
		index,
		newPosition,
	}: ConnectionPointPositionChangeParams) => void;
}

const useRectangularDrag = ({
	canvas,
	canvasFeature,
	handleRectangularPositionChange,
	handleConnectionPointPositionChange,
}: UseRectangularDragParams) => {
	const [rectToMove, setRectToMove] = useState<number | null>(null);
	const [cursorOffset, setCursorOffset] = useState<{
		x: number;
		y: number;
	} | null>(null);

	const getRectangularIndex = useCallback(
		(x: number, y: number) => {
			if (canvasFeature) {
				const rectangulars = canvasFeature.getRectangulars();

				for (let i = 0; i < rectangulars.length; i++) {
					const [left, right, top, bottom] = canvasFeature
						.getRectangulars()
						[i].getBoundingAxes();

					if (x <= right && x >= left && y >= top && y <= bottom) {
						return i;
					}
				}

				return undefined;
			}
		},
		[canvasFeature]
	);

	const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = useCallback(
		(e) => {
			if (canvas && canvasFeature) {
				const canvasBoundingBox = canvas.getBoundingClientRect();

				const mouseX = e.clientX - canvasBoundingBox.width / 2;
				const mouseY = e.clientY - canvasBoundingBox.height / 2;

				const rectangularIndex = getRectangularIndex(mouseX, mouseY);

				if (rectangularIndex !== undefined) {
					setRectToMove(rectangularIndex);

					const rectangularPosition = canvasFeature
						.getRectangulars()
						[rectangularIndex].getPosition();
					setCursorOffset({
						x: mouseX - rectangularPosition.x,
						y: mouseY - rectangularPosition.y,
					});
				}
			}
		},
		[canvas, canvasFeature, getRectangularIndex]
	);

	const handleMouseUp: MouseEventHandler<HTMLCanvasElement> =
		useCallback(() => {
			setRectToMove(null);
			setCursorOffset(null);
		}, []);

	const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = useCallback(
		(e) => {
			if (canvas && canvasFeature && rectToMove !== null && cursorOffset) {
				const canvasBoundingBox = canvas.getBoundingClientRect();

				const mouseX = e.clientX - canvasBoundingBox.width / 2;
				const mouseY = e.clientY - canvasBoundingBox.height / 2;

				const newRectangularPosition = {
					x: mouseX - cursorOffset.x,
					y: mouseY - cursorOffset.y,
				};

				const rectangular = canvasFeature.getRectangulars()[rectToMove];
				const connectionPoint = rectangular.getConnectionPoint();

				if (!(connectionPoint instanceof InitException)) {
					if (
						connectionPoint.getEdge() !== null &&
						connectionPoint.getConnectionStatus() === "connected"
					) {
						const connectionPointRelativePosition =
							connectionPoint.getRelativePosition();

						handleConnectionPointPositionChange({
							index: rectToMove,
							newPosition: {
								x: newRectangularPosition.x + connectionPointRelativePosition.x,
								y: newRectangularPosition.y + connectionPointRelativePosition.y,
							},
						});
					}
				}

				handleRectangularPositionChange({
					index: rectToMove,
					newPosition: newRectangularPosition,
				});
			}
		},
		[
			canvas,
			canvasFeature,
			cursorOffset,
			handleConnectionPointPositionChange,
			handleRectangularPositionChange,
			rectToMove,
		]
	);
	return { handleMouseDown, handleMouseUp, handleMouseMove };
};

export default useRectangularDrag;
