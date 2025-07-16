import { RelativeOrientation } from "./getRelativeOrientation";

type EnlargeDirection = -1 | 0 | 1;

const getEnlargeDirection = ({
	relativeOrientation,
	axis,
}: {
	relativeOrientation: RelativeOrientation;
	axis: "x" | "y";
}): EnlargeDirection => {
	switch (axis) {
		case "x":
			switch (relativeOrientation) {
				case "incedent":
					return 0;
				case "bottom":
					return 0;
				case "top":
					return 0;
				case "right":
					return 1;
				case "left":
					return -1;
			}
		case "y":
			switch (relativeOrientation) {
				case "incedent":
					return 0;
				case "bottom":
					return 1;
				case "top":
					return -1;
				case "right":
					return 0;
				case "left":
					return 0;
			}
	}
};

export default getEnlargeDirection;
