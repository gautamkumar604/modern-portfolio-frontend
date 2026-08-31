export const formatDate = (dateString?: string, isPresent?: boolean): string => {
  if (isPresent) return 'Present';
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};
