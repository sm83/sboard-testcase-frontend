import { Point } from "../types/Point.type";

class ConnectionPathCanvasItem {
	#ctx: CanvasRenderingContext2D;

	#connectionPath: Point[];

	constructor(constructBody: {
		ctx: CanvasRenderingContext2D;
		connectionPath: Point[];
	}) {
		this.#ctx = constructBody.ctx;
		this.#connectionPath = constructBody.connectionPath;
	}

	update(newPath: Point[]) {
		this.#connectionPath = newPath;
	}

	draw() {
		this.#ctx.save();

		if (this.#connectionPath.length <= 2) {
			this.#ctx.strokeStyle = `red`;
		} else {
			this.#ctx.strokeStyle = `#4ef542`;
		}

		this.#ctx.lineWidth = 2;
		this.#ctx.beginPath();

		this.#connectionPath.forEach((pathPoint) => {
			this.#ctx.lineTo(pathPoint.x, pathPoint.y);
		});

		this.#ctx.stroke();

		this.#ctx.restore();
	}
}

export default ConnectionPathCanvasItem;
