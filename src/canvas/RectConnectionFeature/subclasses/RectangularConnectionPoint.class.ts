import { ConnectionPoint } from "../types/ConnectionPoint.type";
import { Point } from "../types/Point.type";

class ConnectionPointItem {
	#ctx: CanvasRenderingContext2D;

	#position: Point;
	#offset: { x: number; y: number };

	#angle: number;
	#pointRadius: number;

	#anlgePointer: Point;

	constructor(constructBody: {
		ctx: CanvasRenderingContext2D;
		pointRadius: number;
		rectangularOrigin: Point;
		connectionPoint: ConnectionPoint;
	}) {
		this.#ctx = constructBody.ctx;
		this.#angle = constructBody.connectionPoint.angle;

		this.#position = constructBody.rectangularOrigin;
		this.#offset = {
			x:
				constructBody.rectangularOrigin.x -
				constructBody.connectionPoint.point.x,
			y:
				constructBody.rectangularOrigin.y -
				constructBody.connectionPoint.point.y,
		};

		this.#pointRadius = constructBody.pointRadius;

		this.#anlgePointer = this.#calculateAnglePointer();
	}

	draw() {
		this.#drawPointCircle();
		this.#drawAngleDirection();
	}

	move(x: number, y: number) {
		this.#position = { x, y };
		this.#anlgePointer = this.#calculateAnglePointer();
	}

	#calculateAnglePointer() {
		return {
			x:
				this.#position.x -
				this.#offset.x +
				30 * Math.sin((this.#angle * Math.PI) / 180),
			y:
				this.#position.y -
				this.#offset.y +
				30 * Math.cos((this.#angle * Math.PI) / 180),
		};
	}

	#drawPointCircle() {
		this.#ctx.save();
		this.#ctx.strokeStyle = `hsla(0, 0.00%, 0.00%, 1)`;

		this.#ctx.lineWidth = 1;
		this.#ctx.beginPath();

		this.#ctx.arc(
			this.#position.x - this.#offset.x,
			this.#position.y - this.#offset.y,
			this.#pointRadius,
			0,
			360,
			false
		);

		this.#ctx.stroke();

		this.#ctx.restore();
	}

	#drawAngleDirection() {
		this.#ctx.save();
		this.#ctx.strokeStyle = "red";

		this.#ctx.lineWidth = 2;
		this.#ctx.beginPath();

		this.#ctx.moveTo(
			this.#position.x - this.#offset.x,
			this.#position.y - this.#offset.y
		);
		this.#ctx.lineTo(this.#anlgePointer.x, this.#anlgePointer.y);

		this.#ctx.stroke();

		this.#ctx.restore();
	}
}

export default ConnectionPointItem;
