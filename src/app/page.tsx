import { logout, validateRequest } from "@/lib/common/lucia";

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <main className="max-w-5xl">
      <div>
        <h1>Dashboard</h1>
        <div className="flex justify-between">
          <button>{!user && <a href={"/login"}>Login</a>}</button>
          <button>{!user && <a href={"/signup"}>Signup</a>}</button>
          {user && (
            <form action={logout}>
              <button type="submit">Logout</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
