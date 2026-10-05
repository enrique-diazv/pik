import Link from "next/link";
import styles from "./brand.module.css";

export function Brand() {
  return <Link href="/" aria-label="PIK, inicio" className={styles.brand}>PIK</Link>;
}
