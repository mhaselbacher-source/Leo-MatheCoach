import type { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Card.module.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "accent" | "soft";
}

export function Card({
  children,
  className,
  tone = "default",
  ...props
}: PropsWithChildren<CardProps>) {
  const classes = [styles.card, styles[tone], className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
