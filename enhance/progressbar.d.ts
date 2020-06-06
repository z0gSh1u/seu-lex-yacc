declare class ProgressBar {
  constructor(description?: string, barLen?: number)
  render(opts: { completed: number; total: number }): void
}
export { ProgressBar }