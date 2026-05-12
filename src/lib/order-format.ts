export const formatOrderNumber = (id: string): string => `#${id.slice(-8).toUpperCase()}`;
