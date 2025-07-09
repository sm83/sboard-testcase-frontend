import { RectangularPositionChangeParams } from "@/app/page";
import RectConnectionFeatureCanvas from "@/canvas/RectConnectionFeature/RectConnectionFeatureCanvas";
import { MouseEventHandler, useCallback, useState } from "react";

// TODO: decompose interface
const useRectangularDrag = ({
	canvas,
	canvasFeature,
	handleRectangularPositionChange,
}: {
	canvas: HTMLCanvasElement | null;
	canvasFeature: RectConnectionFeatureCanvas | null;
	handleRectangularPositionChange: ({
		index,
		newPosition,
	}: RectangularPositionChangeParams) => void;
}) => {
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
			handleRectangularPositionChange,
			rectToMove,
		]
	);
	return { handleMouseDown, handleMouseUp, handleMouseMove };
};

export default useRectangularDrag;
