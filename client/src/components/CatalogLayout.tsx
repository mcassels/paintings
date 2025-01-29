import { useEffect } from "react";
import Layout from "./Layout";

function HomeLayout() {
  useEffect(() => {
    document.title = 'James Gordaneer Artist Catalogue';
  }, []);
  const headerContent = (
    <div>
      <div className="p-4">James Gordaneer Artist Catalogue</div>
      <div className="flex justify-center">
        <div className="w-full bg-slate-500 h-[0.5px]"/>
      </div>
    </div>
  );
  const menuItems = [
    { key: 'home', title: 'Home', route: 'home' },
    { key: 'gallery', title: 'Gallery', route: 'gallery' },
    { key: 'show', title: 'Current Show', route: 'show' },
    { key: 'about', title: 'Biography', route: 'about' },
    { key: 'adoption', title: 'Painting Adoption Project', route: '/adoption', openInNewTab: true },
  ];
  return (
    <Layout headerContent={headerContent} menuItems={menuItems} headerBackground="bg-white font-thin"/>
  );
}

export default HomeLayout;