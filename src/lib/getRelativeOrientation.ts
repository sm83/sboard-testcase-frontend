type RelativeOrientation =
	| "bottom"
	| "bottom-right"
	| "right"
	| "top-right"
	| "top"
	| "top-left"
	| "left"
	| "bottom-left"
	| null;

export const getRelativeOrientation = (
	relativeAngle: number
): RelativeOrientation => {
	if (relativeAngle === 0) return "bottom";
	if (relativeAngle > 0 && relativeAngle < 90) return "bottom-right";
	if (relativeAngle === 90) return "right";
	if (relativeAngle > 90 && relativeAngle < 180) return "top-right";
	if (relativeAngle === 180) return "top";
	if (relativeAngle > 180 && relativeAngle < 270) return "top-left";
	if (relativeAngle === 270) return "left";
	if (relativeAngle > 270 && relativeAngle < 360) return "bottom-left";
	return null;
};
