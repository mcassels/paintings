import { useEffect } from 'react';
import { ConfigProvider, Menu } from 'antd';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PhotoGallery from './pages/PhotoGallery';
import { NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import * as AdoptionPages from './adoption/pages';
import Biography from './pages/Biography';
import { areAdoptionsOpen, getIsMobile, reportAnalytics } from './utils';
import { Header } from 'antd/es/layout/layout';
import AppFooter from './components/AppFooter';
import { MenuOutlined } from '@ant-design/icons';
import AdoptionsAreCurrentlyClosed from './adoption/components/AdoptionsAreCurrentlyClosed';
import ContactUsModal from './components/contactus/ContactUsModal';


const queryClient = new QueryClient();

function AppInner() {
  return (
    <div>
      <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="home" />} />
              <Route path="home" element={<AdoptionPages.LandingPage />} />
              <Route path="gallery" element={<PhotoGallery />} />
              <Route path="about" element={<Biography />} />
              <Route path="why-adopt" element={<AdoptionPages.WhyAdopt />} />
              <Route path="pricing" element={<AdoptionPages.Pricing />} />
              <Route path="adopt" element={<AdoptionPages.HowToAdoptAPainting />} />
              <Route path="faqs" element={<AdoptionPages.FAQs />} />
              <Route path="after-adoption" element={<AdoptionPages.AfterAdoption />} />
              <Route path="art-conservators" element={<AdoptionPages.ArtConservators />} />
              <Route path="*" element={<Navigate replace to="/home" />} />
            </Route>
          </Routes>
      </div>
    </div>
  );
}

function Layout() {
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1];

  useEffect(() => {
    if (location.search.length === 0) {
      reportAnalytics('view_page', { page: selectedKey });
    }
  }, [selectedKey, location.search.length]);

  const headerElem = (
    <Header className="bg-[#193259] text-white text-center justify-center flex flex-col text-3xl p-[8px] h-fit mb-6">
      <div className="pt-2 pb-1">Gordaneer Painting Adoption Project</div>
      {!areAdoptionsOpen() && (
        <div className="text-sm flex justify-center">
          <AdoptionsAreCurrentlyClosed />
        </div>
      )}
    </Header>
  );

  // Menu needs different layout for mobile
  const isMobile = getIsMobile();

  const menuStyle = isMobile ?
    { maxWidth: '60px', flex: 'auto', marginBottom: '1.5rem', backgroundColor: '#193259' } : { width: 'fit-content' }

  return (
    <div className="min-h-svh flex flex-col items-stretch">
      <ContactUsModal />
      <div className="grow">
        {
          !isMobile && headerElem
        }
        <div className="box wrapper">
          <div className="box sidebar">
            <Menu
              mode={isMobile ? 'horizontal' : 'vertical'}
              style={menuStyle}
              defaultSelectedKeys={[selectedKey]}
              selectedKeys={[selectedKey]}
              overflowedIndicator={isMobile ? <MenuOutlined /> : null}
            >
              <Menu.Item key="home" title="Home"><NavLink to="/home">Home</NavLink></Menu.Item>
              <Menu.Item key="gallery" title="Gallery"><NavLink to="/gallery">Gallery</NavLink></Menu.Item>
              <Menu.Item key="about" title="Biography"><NavLink to="/about">Biography</NavLink></Menu.Item>
              <Menu.Item key="why-adopt" title="About this Project"><NavLink to="/why-adopt">About this Project</NavLink></Menu.Item>
              <Menu.Item key="pricing" title="Pricing"><NavLink to="/pricing">Pricing</NavLink></Menu.Item>
              <Menu.Item key="adopt" title="Adopt a Painting"><NavLink to="/adopt">Adopt a Painting</NavLink></Menu.Item>
              <Menu.Item key="after-adoption" title="After Adoption"><NavLink to="/after-adoption">After Adoption</NavLink></Menu.Item>
              <Menu.Item key="art-conservators" title="Care & Conservation"><NavLink to="/art-conservators">Care & Conservation</NavLink></Menu.Item>
              <Menu.Item key="faqs" title="FAQs"><NavLink to="/faqs">FAQs</NavLink></Menu.Item>
            </Menu>
            {isMobile && <div className="w-full">{headerElem}</div>}
          </div>
          <div className="box content">
            <Outlet />
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              activeBarHeight: 0, // This removes the highlight bar on the menu when its horizontal on mobile
            },
          },
        }}
      >
        <AppInner />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;