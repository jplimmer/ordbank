export function buildOptions<T extends readonly string[]>(
  values: T,
  labels: Record<T[number], string>
) {
  return values.map((v) => ({
    value: v,
    label: labels[v as T[number]],
  })) as { value: T[number]; label: string }[];
}
