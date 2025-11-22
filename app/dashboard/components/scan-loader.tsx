import styles from "./scan-loader.module.css"

export default function ScanLoader() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.databaseIcon}>
        <div className={styles.layer}></div>
        <div className={styles.layer}></div>
        <div className={styles.layer}></div>
      </div>

      <div className={styles.scanBar}></div>

      <div className={styles.entities}>
        <div className={styles.entity}></div>
        <div className={styles.entity}></div>
        <div className={styles.entity}></div>
        <div className={styles.entity}></div>
      </div>
    </div>
  )
}
