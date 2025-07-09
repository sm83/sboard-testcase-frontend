import { AlignmentNormal } from "./AlignmentNormal.type";
import { Point } from "./Point.type";

export type Edge = {
	vertice1: Point;
	vertice2: Point;
	alignmentNormal: AlignmentNormal;
};
