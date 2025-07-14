import clsx from "clsx";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text?: string;
	children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, text, ...rest }) => {
	return (
		<button {...rest} className={clsx(styles["button"], "roboto-regular")}>
			{text && <span className={styles["button__span"]}>{text}</span>}
			{children}
		</button>
	);
};

export default Button;
