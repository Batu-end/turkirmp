import { useTranslations } from 'next-intl';
import styles from './page.module.css';

export default function Home() {
  const t = useTranslations('HomePage');
  return <h1 className={styles.title}>{t('title')}</h1>;
}
