/** Ambient types so `import styles from './X.module.css'` typechecks. */
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
