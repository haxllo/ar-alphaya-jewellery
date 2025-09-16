export const dynamic = 'force-static';

export default function AdminRedirect() {
  if (typeof window !== 'undefined') {
    window.location.replace('/admin/index.html');
  }
  return null;
}


