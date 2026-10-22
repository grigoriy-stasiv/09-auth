
import type { ReactNode } from 'react';
import css from './layout.module.css';

type FilterLayoutProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

export default function FilterLayout({
  children,
  sidebar,
}: FilterLayoutProps) {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
}