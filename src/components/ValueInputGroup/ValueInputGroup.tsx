import styles from "./ValueInputGroup.module.scss";

const ValueInputGroup = ({ children }: { children: React.ReactNode }) => {
	return <div className={styles["value-input-group"]}>{children}</div>;
};

export default ValueInputGroup;
