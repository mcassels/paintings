import { useEffect } from "react";
import Layout from "./Layout";

function HomeLayout() {
  useEffect(() => {
    document.title = 'James Gordaneer Artist Catalogue';
  }, []);
  const headerContent = (<div className="pt-2 pb-1">James Gordaneer Artist Catalogue</div>)
  const menuItems = [
    { key: 'home', title: 'Home', route: 'home' },
    { key: 'gallery', title: 'Gallery', route: 'gallery' },
    { key: 'show', title: 'Current Show', route: 'show' },
    { key: 'about', title: 'Biography', route: 'about' },
    { key: 'adoption', title: 'Painting Adoption Project', route: '/adoption', openInNewTab: true },
  ];
  return (
    <Layout headerContent={headerContent} menuItems={menuItems} />
  );
}

export default HomeLayout;