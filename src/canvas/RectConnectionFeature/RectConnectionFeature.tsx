import styles from "./RectConnectionFeature.module.scss";

import { useCallback, useEffect, useState } from "react";
import RectConnectionFeatureCanvas from "./RectConnectionFeatureCanvas";
import { Rect } from "./types/Rect.type";
import { ConnectionPoint } from "./types/ConnectionPoint.type";
import { Point } from "./types/Point.type";
import useRectangularDrag from "@/lib/useRectangularDrag";

const RectConnectionFeature = ({
	rectangulars,
	connectionPoints,
	connectionPath,
}: {
	rectangulars: [Rect, Rect];
	connectionPoints: [ConnectionPoint, ConnectionPoint] | null;
	connectionPath: Point[] | null;
}) => {
	const wrapperId: string = "rect-connection-feature-wrapper";
	const featureId: string = "rect-connection-feature";

	// TODO: replace with actual ref
	const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [canvasFeature, setCanvasFeature] =
		useState<RectConnectionFeatureCanvas | null>(null);

	// initializing wrapper once
	useEffect(() => {
		const wrapperElement = document.getElementById(
			wrapperId
		) as HTMLDivElement | null;
		if (wrapperElement) {
			setWrapper(wrapperElement);
		}
	}, []);

	// initializing canvas and ctx once if wrapper changed
	useEffect(() => {
		const canvasElement = document.getElementById(
			featureId
		) as HTMLCanvasElement | null;

		if (canvasElement && wrapper) {
			canvasElement.width = wrapper.clientWidth;
			canvasElement.height = wrapper.clientHeight;

			setCanvas(canvasElement);
			setCtx(canvasElement.getContext("2d"));
		}
	}, [wrapper]);

	// creating feature if canvas and ctx exists
	useEffect(() => {
		if (canvas && ctx) {
			const rectConnectionFeature = new RectConnectionFeatureCanvas({
				canvas,
				ctx,
				rectangulars,
				connectionPoints,
				connectionPath,
			});
			setCanvasFeature(rectConnectionFeature);
		}
	}, [canvas, connectionPath, connectionPoints, ctx, rectangulars]);

	// resize callback
	const redrawFeature = useCallback(() => {
		if (canvas && ctx && wrapper) {
			canvas.width = wrapper.clientWidth;
			canvas.height = wrapper.clientHeight;

			canvasFeature?.resizeCanvas(canvas);
		}
	}, [canvas, ctx, canvasFeature, wrapper]);

	// resize handler
	useEffect(() => {
		window.addEventListener("resize", redrawFeature);
		return () => window.removeEventListener("resize", redrawFeature);
	}, [redrawFeature]);

	// dragger
	const { handleMouseDown, handleMouseUp, handleMouseMove } =
		useRectangularDrag({ canvas, canvasFeature });

	return (
		<div id={wrapperId} className={styles["rect-connection-feature-wrapper"]}>
			<canvas
				id={featureId}
				className={styles["rect-connection-feature"]}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
			/>
		</div>
	);
};

export default RectConnectionFeature;
