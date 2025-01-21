import { areAdoptionsOpen } from '../utils';
import AdoptionsAreCurrentlyClosed from './components/AdoptionsAreCurrentlyClosed';
import Layout from '../components/Layout';

function AdoptionLayout() {
  const headerContent = (
    <>
      <div className="pt-2 pb-1">Gordaneer Painting Adoption Project</div>
      {!areAdoptionsOpen() && (
        <div className="text-sm flex justify-center">
          <AdoptionsAreCurrentlyClosed />
        </div>
      )}
    </>
  );
  const menuItems = [
    { key: 'home', title: 'Home', route: 'home' },
    { key: 'gallery', title: 'Gallery', route: 'gallery' },
    { key: 'about', title: 'Biography', route: 'about' },
    { key: 'why-adopt', title: 'About this Project', route: 'why-adopt' },
    { key: 'pricing', title: 'Pricing', route: 'pricing' },
    { key: 'adopt', title: 'Adopt a Painting', route: 'adopt' },
    { key: 'after-adoption', title: 'After Adoption', route: 'after-adoption' },
    { key: 'art-conservators', title: 'Care & Conservation', route: 'art-conservators' },
    { key: 'faqs', title: 'FAQs', route: 'faqs' },
    { key: 'catalog', title: 'Catalogue Site', route: '/catalog' },
  ];

  return (
    <Layout headerContent={headerContent} menuItems={menuItems}/>
  );
}

export default AdoptionLayout;