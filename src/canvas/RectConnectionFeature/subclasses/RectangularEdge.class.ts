import { Exception } from "@/lib/dataConverter";
import { Point } from "../types/Point.type";

type AlignmentNormal = 0 | 90 | 180 | 270;

// subclasses structures gracefully allows to use instanceof,
// which is very useful in any further exception catching.
export class VerticalAlignment {
	x: number;
	yMin: number;
	yMax: number;

	// normal is an angle which points perpendicular outside from edge.
	normal: AlignmentNormal;

	constructor(constructorBody: {
		x: number;
		yMin: number;
		yMax: number;
		normal: AlignmentNormal;
	}) {
		this.x = constructorBody.x;
		this.yMin = constructorBody.yMin;
		this.yMax = constructorBody.yMax;
		this.normal = constructorBody.normal;
	}
}

export class HorizontalAlignment {
	y: number;
	xMin: number;
	xMax: number;

	normal: AlignmentNormal;

	constructor(constructorBody: {
		y: number;
		xMin: number;
		xMax: number;
		normal: AlignmentNormal;
	}) {
		this.y = constructorBody.y;
		this.xMin = constructorBody.xMin;
		this.xMax = constructorBody.xMax;

		this.normal = constructorBody.normal;
	}
}

// main edge class
class RectangularEdgeItem {
	alignment: VerticalAlignment | HorizontalAlignment | Exception;

	constructor(
		vertice1: Point,
		vertice2: Point,
		alignmentNormal: AlignmentNormal
	) {
		this.alignment = this.#constructAlignment(
			vertice1,
			vertice2,
			alignmentNormal
		);
	}

	// this method form is used to return result,
	// as it prevents code from further execution and increases perfomance
	#constructAlignment(
		vertice1: Point,
		vertice2: Point,
		alignmentNormal: AlignmentNormal
	) {
		if (vertice1.x === vertice2.x) {
			const comparementResult = this.#compareAlignment(vertice1.y, vertice2.y);

			if (comparementResult instanceof Exception) {
				return comparementResult as Exception;
			}

			return new VerticalAlignment({
				x: vertice1.x,
				yMin: comparementResult[0],
				yMax: comparementResult[1],
				normal: alignmentNormal,
			});
		}

		if (vertice1.y === vertice2.y) {
			const comparementResult = this.#compareAlignment(vertice1.x, vertice2.x);

			if (comparementResult instanceof Exception) {
				return comparementResult as Exception;
			}

			return new HorizontalAlignment({
				y: vertice1.y,
				xMin: comparementResult[0],
				xMax: comparementResult[1],
				normal: alignmentNormal,
			});
		}

		return new Exception("Edge is not parallel to X or Y axis.");
	}

	// method to compare with same strategy of forming exceptions.
	#compareAlignment(
		value1: number,
		value2: number
	): [number, number] | Exception {
		if (value1 < value2) return [value1, value2];
		if (value1 > value2) return [value2, value1];
		return new Exception("Vertices of edge are in the same position.");
	}
}

export default RectangularEdgeItem;
