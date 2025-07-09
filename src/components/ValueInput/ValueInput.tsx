import clsx from "clsx";
import styles from "./ValueInput.module.scss";

interface ValueInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	value: number | string;
}

const ValueInput: React.FC<ValueInputProps> = ({ name, value, ...rest }) => {
	return (
		<div className={styles["value-input"]}>
			<span className={clsx(styles["value-input__span"], "roboto-regular")}>
				{name}
			</span>
			<input
				{...rest}
				className={styles["value-input__input-itself"]}
				value={value}
			/>
		</div>
	);
};

export default ValueInput;
