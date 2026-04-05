import styles from "./ScreenHeader.module.css";

interface ScreenHeaderProps {
  eyebrow: string;
  title: string;
  text: string;
}

export function ScreenHeader({ eyebrow, title, text }: ScreenHeaderProps) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
    </header>
  );
}
