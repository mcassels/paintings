import React, { useEffect } from 'react';
import { ConfigProvider, Menu } from 'antd';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactGA from 'react-ga4';

import PhotoGallery from './PhotoGallery';
import { NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import HowToAdoptAPainting from './HowToAdoptAPainting';
import FAQs from './FAQs';
import WhyAdopt from './WhyAdopt';
import AfterAdoption from './AfterAdoption';
import LandingPage from './LandingPage';
import Biography from './Biography';
import { areAdoptionsOpen } from './utils';
import Pricing from './Pricing';
import { CARE_AND_CONSERVATION_KEY } from './constants';
import TextPage from './TextPage';
import { Header } from 'antd/es/layout/layout';
import AppFooter from './AppFooter';
import { MenuOutlined } from '@ant-design/icons';


const queryClient = new QueryClient();

function AppInner() {
  ReactGA.initialize("G-L1MXESLN6H");

  return (
    <div>
      <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="home" />} />
              <Route path="home" element={<LandingPage />} />
              <Route path="gallery" element={<PhotoGallery />} />
              <Route path="about" element={<Biography />} />
              <Route path="why-adopt" element={<WhyAdopt />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="adopt" element={<HowToAdoptAPainting />} />
              <Route path="faqs" element={<FAQs />} />
              <Route path="after-adoption" element={<AfterAdoption />} />
              <Route path="art-conservators" element={<TextPage textKey={CARE_AND_CONSERVATION_KEY} />} />
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
      window.gtag('event', 'view_page', { page: selectedKey });
    }
  }, [selectedKey, location.search.length]);

  // Menu needs different layout for mobile
  // This is the same check that the css file uses to determine mobile
  const isSizeForMobile = window.matchMedia('only screen and (max-width: 600px)').matches;
  // However, if you are on a computer and you resize the window to be smaller than 600px, we do not want
  // to show the mobile layout, so we need to check if the window is actually a mobile device
  const isMobileDevice = /Mobi/i.test(window.navigator.userAgent)
  const isMobile = isSizeForMobile && isMobileDevice;

  const headerElem = (
    <Header className="bg-[#193259] text-white text-center justify-center flex flex-col text-3xl p-[8px] h-fit mb-6">
      <div className="pt-2">Gordaneer Painting Adoption Project</div>
      <div className="text-sm pt-1">
        {areAdoptionsOpen() ? 'Adoptions close May 9th' : 'Adoptions open soon!'}
      </div>
    </Header>
  );

  const menuStyle = isMobile ? 
    { minWidth: '30px', flex: 'auto', marginBottom: '1.5rem', backgroundColor: '#193259' } : { width: 'fit-content' }

  return (
    <div className="min-h-svh flex flex-col items-stretch">
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
            {isMobile && headerElem}
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