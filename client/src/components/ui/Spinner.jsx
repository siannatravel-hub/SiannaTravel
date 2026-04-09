import styles from './Spinner.module.css';

export default function Spinner() {
  return (
    <div className={styles['spinner-wrapper']} role="status">
      <div className={styles.spinner} />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
