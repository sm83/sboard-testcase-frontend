import { Exception } from "@/lib/dataConverter";
import { ConnectionPoint } from "../types/ConnectionPoint.type";
import { Point } from "../types/Point.type";
import { Rect } from "../types/Rect.type";
import { Size } from "../types/Size.type";
import ConnectionPointItem from "./RectangularConnectionPoint.class";
import RectangularEdgeItem, {
	HorizontalAlignment,
	VerticalAlignment,
} from "./RectangularEdge.class";

class RectangularItem {
	#canvas: HTMLCanvasElement;
	#ctx: CanvasRenderingContext2D;

	#index: number;

	#position: Point;
	#size: Size;
	#vertices: Point[];
	#edges: RectangularEdgeItem[];

	#connectionPoint: ConnectionPointItem | Exception;

	#pushError: (newError: Exception) => void;

	constructor(constructBody: {
		canvas: HTMLCanvasElement;
		ctx: CanvasRenderingContext2D;
		index: number;
		rectangular: Rect;
		connectionPoints: [ConnectionPoint, ConnectionPoint] | null;

		pushError: (newError: Exception) => void;
	}) {
		this.#canvas = constructBody.canvas;
		this.#ctx = constructBody.ctx;

		this.#index = constructBody.index;

		this.#position = constructBody.rectangular.position;
		this.#size = constructBody.rectangular.size;

		this.#vertices = this.#calculateVertices();
		this.#edges = this.#calculateEdges();
		this.#connectionPoint = this.#findConnectionPoint(
			constructBody.connectionPoints
		);

		this.#pushError = constructBody.pushError;
	}

	#calculateVertices() {
		return [
			// top-left
			{
				x: this.#position.x - this.#size.width / 2,
				y: this.#position.y - this.#size.height / 2,
			},
			// top-right
			{
				x: this.#position.x + this.#size.width / 2,
				y: this.#position.y - this.#size.height / 2,
			},
			// bottom-right
			{
				x: this.#position.x + this.#size.width / 2,
				y: this.#position.y + this.#size.height / 2,
			},
			//bottom-left
			{
				x: this.#position.x - this.#size.width / 2,
				y: this.#position.y + this.#size.height / 2,
			},
		];
	}

	#calculateEdges() {
		return [
			new RectangularEdgeItem(this.#vertices[0], this.#vertices[1], 180),
			new RectangularEdgeItem(this.#vertices[1], this.#vertices[2], 90),
			new RectangularEdgeItem(this.#vertices[2], this.#vertices[3], 0),
			new RectangularEdgeItem(this.#vertices[3], this.#vertices[0], 270),
		];
	}

	#findConnectionPoint(
		connectionPoints: [ConnectionPoint, ConnectionPoint] | null
	) {
		if (connectionPoints === null) {
			const exception = new Exception(
				"Connection points was not provided to Rectangular Item constructor."
			);

			this.#pushError(exception);
			return exception;
		}

		for (const connectionPoint of connectionPoints) {
			for (const edge of this.#edges) {
				const edgeAlignment = edge.alignment;

				if (edgeAlignment instanceof VerticalAlignment) {
					if (
						edgeAlignment.x === connectionPoint.point.x &&
						connectionPoint.point.y >= edgeAlignment.yMin &&
						connectionPoint.point.y <= edgeAlignment.yMax
					) {
						return new ConnectionPointItem({
							ctx: this.#ctx,
							pointRadius: 10,
							rectangularOrigin: this.#position,
							connectionPoint,
						});
					}
				}

				if (edgeAlignment instanceof HorizontalAlignment) {
					if (
						edgeAlignment.y === connectionPoint.point.y &&
						connectionPoint.point.x >= edgeAlignment.xMin &&
						connectionPoint.point.x <= edgeAlignment.xMax
					) {
						return new ConnectionPointItem({
							ctx: this.#ctx,
							pointRadius: 10,
							rectangularOrigin: this.#position,
							connectionPoint,
						});
					}
				}
			}
		}

		{
			const exception = new Exception(
				`Can not find connection point of the rectangular with index: ${
					this.#index
				}`
			);

			this.#pushError(exception);
			return exception;
		}
	}

	getBoundingAxes(): [number, number, number, number] {
		const [left, right, top, bottom] = [
			this.#position.x - this.#size.width / 2,
			this.#position.x + this.#size.width / 2,
			this.#position.y - this.#size.height / 2,
			this.#position.y + this.#size.height / 2,
		];

		return [left, right, top, bottom];
	}

	getPosition(): { x: number; y: number } {
		return { x: this.#position.x, y: this.#position.y };
	}

	getConnectionPoint() {
		return this.#connectionPoint;
	}

	move(x: number, y: number) {
		this.#position = { x, y };

		if (!(this.#connectionPoint instanceof Exception)) {
			this.#connectionPoint.move(x, y);
		}

		this.#vertices = this.#calculateVertices();
	}
	draw() {
		this.#ctx.save();
		this.#ctx.strokeStyle = `hsla(0, 0.00%, 0.00%, 1)`;

		this.#ctx.lineWidth = 1;
		this.#ctx.beginPath();
		this.#ctx.moveTo(this.#vertices[3].x, this.#vertices[3].y);
		this.#vertices.forEach((verticeItem) => {
			this.#ctx.lineTo(verticeItem.x, verticeItem.y);
		});
		this.#ctx.stroke();

		this.#ctx.restore();
	}
}

export default RectangularItem;
