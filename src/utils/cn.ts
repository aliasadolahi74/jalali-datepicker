/**
 * Tiny className joiner. Local to the feature on purpose — the picker pulls in no
 * `clsx`/`tailwind-merge` and no host-app utility, so it stays self-contained.
 */
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(' ');
}
