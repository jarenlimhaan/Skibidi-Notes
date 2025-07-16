import withAuth from '@/components/auth/authGuard';
import Library from '@/components/library'; // adjust if needed
function Page() {
  return (
    <div>
      <Library />
    </div>
  );
}

export default withAuth(Page);