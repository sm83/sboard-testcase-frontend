import { Point } from "../types/Point.type";

class ConnectionPathItem {
	#ctx: CanvasRenderingContext2D;

	#connectionPath: Point[];

	constructor(constructBody: {
		ctx: CanvasRenderingContext2D;
		connectionPath: Point[];
	}) {
		this.#ctx = constructBody.ctx;
		this.#connectionPath = constructBody.connectionPath;
	}

	draw() {
		this.#ctx.save();
		this.#ctx.strokeStyle = `red`;

		this.#ctx.lineWidth = 2;
		this.#ctx.beginPath();

		this.#connectionPath.forEach((pathPoint) => {
			this.#ctx.lineTo(pathPoint.x, pathPoint.y);
		});

		this.#ctx.stroke();

		this.#ctx.restore();
	}
}

export default ConnectionPathItem;
