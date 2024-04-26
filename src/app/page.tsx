import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div>
        <h1>Dashboard</h1>
        <button>
          <a href={"/login"}>Login</a>
        </button>
      </div>
    </main>
  );
}
