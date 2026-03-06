export function handleFileSelect(
  e: React.ChangeEvent<HTMLInputElement>,
  onThumbnailSelect: (url: string) => void,
) {
  const file = e.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  onThumbnailSelect(url);
}
