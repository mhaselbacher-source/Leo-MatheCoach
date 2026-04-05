import styles from "./MascotHero.module.css";

interface MascotHeroProps {
  title: string;
  subtitle: string;
}

export function MascotHero({ title, subtitle }: MascotHeroProps) {
  return (
    <div className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Fido begleitet dich</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{subtitle}</p>
      </div>

      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={`${import.meta.env.BASE_URL}mascot/fido-main-v1.png`}
          alt="Fido, der Hundemaskottchen von Leo MatheCoach"
        />
      </div>
    </div>
  );
}
