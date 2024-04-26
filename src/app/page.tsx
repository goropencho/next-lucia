import Image from "next/image";

export default function Home() {
  return (
    <main className="max-w-5xl">
      <div>
        <h1>Dashboard</h1>
        <div className="flex justify-between">
          <button>
            <a href={"/login"}>Login</a>
          </button>
          <button>
            <a href={"/signup"}>Sign Up</a>
          </button>
        </div>
      </div>
    </main>
  );
}
