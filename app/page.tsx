import NavBar from "@/components/ui/nav";
import FileBrowser from "@/components/ui/file-browser";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="py-8">
        <FileBrowser />
      </main>
    </div>
  );
}
