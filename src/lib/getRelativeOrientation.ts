export type RelativeOrientation =
	| "bottom"
	| "right"
	| "top"
	| "left"
	| "incedent";

export const getRelativeOrientation = (
	relativeAngle: number
): RelativeOrientation => {
	if (relativeAngle === 0) return "bottom";
	if (relativeAngle === 90) return "right";
	if (relativeAngle === 180) return "top";
	if (relativeAngle === 270) return "left";
	return "incedent";
};
