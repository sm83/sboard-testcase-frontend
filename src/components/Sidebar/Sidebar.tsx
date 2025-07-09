import clsx from "clsx";
import styles from "./Sidebar.module.scss";

const Sidebar = ({
	position,
	children,
}: {
	position: "left" | "right";
	children: React.ReactNode;
}) => {
	return (
		<div
			className={clsx(
				styles["sidebar"],
				position === "left" && styles["sidebar_left"],
				position === "right" && styles["sidebar_right"]
			)}
		>
			{children}
		</div>
	);
};

export default Sidebar;
