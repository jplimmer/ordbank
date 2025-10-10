import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta {
    align?: 'start' | 'center' | 'end';
  }
}
