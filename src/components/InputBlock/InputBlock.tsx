import clsx from "clsx";
import styles from "./InputBlock.module.scss";

const InputBlock = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => {
	return (
		<div className={styles["input-block"]}>
			<span
				className={clsx("roboto-regular", styles["input-block__title-span"])}
			>
				{title}
			</span>
			<div className={styles["input-block__items"]}>{children}</div>
		</div>
	);
};

export default InputBlock;
