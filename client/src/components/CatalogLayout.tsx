import Layout from "./Layout";

function HomeLayout() {
  const headerContent = (<div className="pt-2 pb-1">James Gordaneer: Artist Catalogue</div>)
  const menuItems = [
    { key: 'home', title: 'Home', route: 'home' },
    { key: 'gallery', title: 'Gallery', route: 'gallery' },
    { key: 'about', title: 'Biography', route: 'about' },
    { key: 'adoption', title: 'Painting Adoption Project', route: '/adoption' },
  ];
  return (
    <Layout headerContent={headerContent} menuItems={menuItems} />
  );
}

export default HomeLayout;