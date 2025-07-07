import { Exception } from "@/lib/dataConverter";
import ConnectionPathItem from "./subclasses/RectangularConnectionPath.class";
import ConnectionPointItem from "./subclasses/RectangularConnectionPoint.class";
import RectangularItem from "./subclasses/RectangularItem.class";
import { ConnectionPoint } from "./types/ConnectionPoint.type";
import { Point } from "./types/Point.type";
import { Rect } from "./types/Rect.type";

class RectConnectionFeatureCanvas {
	#canvas: HTMLCanvasElement;
	#ctx: CanvasRenderingContext2D;

	#rectangulars: [RectangularItem, RectangularItem];
	#connectionPointsLink: ConnectionPointItem[];
	#connectionPath: ConnectionPathItem | null = null;

	#errors: Exception[] = [];
	#pushError(newError: Exception) {
		this.#errors.push(newError);
	}

	constructor(constructBody: {
		canvas: HTMLCanvasElement;
		ctx: CanvasRenderingContext2D;

		rectangulars: [Rect, Rect];
		connectionPoints: [ConnectionPoint, ConnectionPoint] | null;
		connectionPath: Point[] | null;
	}) {
		this.#canvas = constructBody.canvas;
		this.#ctx = constructBody.ctx;

		this.#rectangulars = [
			new RectangularItem({
				canvas: constructBody.canvas,
				ctx: constructBody.ctx,
				index: 0,
				rectangular: { ...constructBody.rectangulars[0] },
				connectionPoints: constructBody.connectionPoints,
				pushError: this.#pushError,
			}),
			new RectangularItem({
				canvas: constructBody.canvas,
				ctx: constructBody.ctx,
				index: 1,
				rectangular: { ...constructBody.rectangulars[1] },
				connectionPoints: constructBody.connectionPoints,
				pushError: this.#pushError,
			}),
		];

		this.#connectionPointsLink = this.getConnectionPointsFromRectangulars();

		if (constructBody.connectionPath) {
			this.#connectionPath = new ConnectionPathItem({
				ctx: constructBody.ctx,
				connectionPath: constructBody.connectionPath,
			});
		}

		this.#drawAll();
	}

	resizeCanvas(updatedCanvas: HTMLCanvasElement) {
		this.#canvas = updatedCanvas;

		this.#drawAll();
	}

	getRectangulars() {
		return this.#rectangulars;
	}

	getConnectionPointsFromRectangulars(): ConnectionPointItem[] {
		const connectionPoints: ConnectionPointItem[] = [];

		this.#rectangulars.forEach((rect) => {
			const connectionPoint = rect.getConnectionPoint();

			if (connectionPoint instanceof Exception) {
				this.#pushError(connectionPoint);
			} else {
				connectionPoints.push(connectionPoint);
			}
		});

		return connectionPoints;
	}

	// move code area
	moveRectangular({ index, x, y }: { index: number; x: number; y: number }) {
		this.#rectangulars[index].move(x, y);

		this.#drawAll();
	}

	// drawing code area
	#drawAll() {
		this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

		this.#drawRects();

		if (this.#connectionPointsLink) {
			this.#drawConnectionPoints();
		}

		if (this.#connectionPath) {
			this.#drawConnectionPath();
		}
	}

	#drawRects() {
		this.#ctx.save();
		this.#ctx.translate(this.#canvas.width / 2, this.#canvas.height / 2);

		this.#rectangulars.forEach((reclangularItem) => {
			reclangularItem.draw();
		});

		this.#ctx.restore();
	}

	#drawConnectionPoints() {
		this.#ctx.save();
		this.#ctx.translate(this.#canvas.width / 2, this.#canvas.height / 2);

		this.#connectionPointsLink.forEach((connectionPoint) => {
			if (!(connectionPoint instanceof Exception)) {
				connectionPoint.draw();
			}
		});

		this.#ctx.restore();
	}

	#drawConnectionPath() {
		this.#ctx.save();
		this.#ctx.translate(this.#canvas.width / 2, this.#canvas.height / 2);

		if (this.#connectionPath) {
			this.#connectionPath.draw();
		}

		this.#ctx.restore();
	}
}

export default RectConnectionFeatureCanvas;
