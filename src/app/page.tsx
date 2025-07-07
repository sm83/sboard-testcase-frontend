"use client";

import RectConnectionFeature from "@/canvas/RectConnectionFeature/RectConnectionFeature";
import styles from "./page.module.scss";
import { useState } from "react";
import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";
import { ConnectionPoint } from "@/canvas/RectConnectionFeature/types/ConnectionPoint.type";
import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";
import { dataConverter, Exception } from "@/lib/dataConverter";

export default function Home() {
	const [rectangulars, setRectangulars] = useState<[Rect, Rect]>([
		{ position: { x: 0, y: 0 }, size: { height: 100, width: 200 } },
		{ position: { x: 100, y: 150 }, size: { height: 100, width: 200 } },
	]);

	const [connectionPoints, setConnectionPoints] = useState<
		[ConnectionPoint, ConnectionPoint] | null
	>([
		{ point: { x: 50, y: -50 }, angle: 180 },
		{ point: { x: 170, y: 200 }, angle: 0 },
	]);

	const [connectionPath, setConnectionPath] = useState<Point[] | null>(null);

	// useEffect(() => {
	// 	const pathCalculationResult = dataConverter(
	// 		rectangulars[0],
	// 		rectangulars[1]
	// 	);
	// }, [rectangulars]);

	return (
		<main className={styles["page-wrapper"]}>
			<RectConnectionFeature
				rectangulars={rectangulars}
				connectionPoints={connectionPoints}
				connectionPath={connectionPath}
			/>
		</main>
	);
}
