
export function formatDate(date: Date | undefined): string {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function create_obj_clean_undefined(data){
    return Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
}