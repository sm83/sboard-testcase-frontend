import { isPointIntersectsRect } from "@/lib/isPointIntersectsRect";
import { Point } from "../types/Point.type";
import { Rect } from "../types/Rect.type";
import { VerticeNormalAlignment } from "../types/VerticeNormalAlignment.type";
import { getRectBoundingAxes } from "@/lib/getRectBoundingAxes";
import { AlignmentNormal } from "../types/AlignmentNormal.type";
import { ConnectionPoint } from "../types/ConnectionPoint.type";
import { InitException } from "./InitException.class";

class PointNode {
	position: Point;
	correct: boolean;

	// TODO: error applience
	#initError: InitException | null = null;

	constructor(constructBody: {
		vertice: Point;
		alignment: VerticeNormalAlignment | number;
		offsetDistance: number;
		otherRectangular: Rect;
	}) {
		// if alignment is angle number - we are providing cPoint vertice position,
		// which should be offsetted by this.#getConnectionPointOffsetted
		if (typeof constructBody.alignment === "number") {
			const cPointOffsetted = this.#getConnectionPointOffsetted({
				cPoint: {
					point: constructBody.vertice,
					angle: constructBody.alignment,
				},
				offset: constructBody.offsetDistance,
			});

			if (cPointOffsetted === null) {
				this.position = constructBody.vertice;
				this.correct = false;
				this.#initError = new InitException(
					"Point Node has angle alignment, which is used when Point Node is constructing as Point Node of Connection Point. But it does not perpendicular for its edge ( defined by current geometry system simplied)."
				);
			} else {
				this.position = cPointOffsetted;
				this.correct = this.#checkCorrectnessOfIntersection({
					position: this.position,
					offsetDistance: constructBody.offsetDistance,
					otherRectangular: constructBody.otherRectangular,
				});
			}
		} else {
			switch (constructBody.alignment) {
				case "bottom-right":
					this.position = {
						x: constructBody.vertice.x + constructBody.offsetDistance,
						y: constructBody.vertice.y + constructBody.offsetDistance,
					};
					this.correct = this.#checkCorrectnessOfIntersection({
						position: this.position,
						offsetDistance: constructBody.offsetDistance,
						otherRectangular: constructBody.otherRectangular,
					});
					break;
				case "top-right":
					this.position = {
						x: constructBody.vertice.x + constructBody.offsetDistance,
						y: constructBody.vertice.y - constructBody.offsetDistance,
					};
					this.correct = this.#checkCorrectnessOfIntersection({
						position: this.position,
						offsetDistance: constructBody.offsetDistance,
						otherRectangular: constructBody.otherRectangular,
					});
					break;
				case "top-left":
					this.position = {
						x: constructBody.vertice.x - constructBody.offsetDistance,
						y: constructBody.vertice.y - constructBody.offsetDistance,
					};
					this.correct = this.#checkCorrectnessOfIntersection({
						position: this.position,
						offsetDistance: constructBody.offsetDistance,
						otherRectangular: constructBody.otherRectangular,
					});
					break;
				case "bottom-left":
					this.position = {
						x: constructBody.vertice.x - constructBody.offsetDistance,
						y: constructBody.vertice.y + constructBody.offsetDistance,
					};
					this.correct = this.#checkCorrectnessOfIntersection({
						position: this.position,
						offsetDistance: constructBody.offsetDistance,
						otherRectangular: constructBody.otherRectangular,
					});
					break;
			}
		}
	}

	// getters code area

	getError() {
		return this.#initError;
	}

	// setters code area

	clearError() {
		this.#initError = null;
	}

	// inner checks code area

	// if Point Node is not intersecting other rectangular (with its offset)
	// Point Node is correct and can be used during path search.
	#checkCorrectnessOfIntersection({
		position,
		otherRectangular,
		offsetDistance,
	}: {
		position: Point;
		otherRectangular: Rect;
		offsetDistance: number;
	}) {
		const [left, right, top, bottom] = getRectBoundingAxes({
			rect: otherRectangular,
			offset: offsetDistance,
		});

		return !isPointIntersectsRect({
			point: position,
			left,
			right,
			top,
			bottom,
		});
	}

	#getConnectionPointOffsetted({
		cPoint,
		offset = 0,
	}: {
		cPoint: ConnectionPoint;
		offset?: number;
	}): Point | null {
		const angle = cPoint.angle as AlignmentNormal;

		switch (angle) {
			case 0:
				return { x: cPoint.point.x, y: cPoint.point.y + offset };
			case 90:
				return { x: cPoint.point.x + offset, y: cPoint.point.y };
			case 180:
				return { x: cPoint.point.x, y: cPoint.point.y - offset };
			case 270:
				return { x: cPoint.point.x - offset, y: cPoint.point.y };
			default:
				return null;
		}
	}
}

export default PointNode;
