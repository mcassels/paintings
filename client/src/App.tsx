import React from 'react';
import { Menu } from 'antd';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PhotoGallery from './PhotoGallery';
import { NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import HowToAdoptAPainting from './HowToAdoptAPainting';
import FAQs from './FAQs';
import TextPage from './TextPage';
import { JIM_BIO_KEY } from './constants';
import WhyAdopt from './WhyAdopt';
import AfterAdoption from './AfterAdoption';
import ArtConservators from './ArtConservators';
import LandingPage from './LandingPage';


const queryClient = new QueryClient();

function AppInner() {
  return (
    <div>
      <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="home" />} />
              <Route path="home" element={<LandingPage />} />
              <Route path="gallery" element={<PhotoGallery />} />
              <Route path="about" element={<TextPage textKey={JIM_BIO_KEY} />} />
              <Route path="why-adopt" element={<WhyAdopt />} />
              <Route path="adopt" element={<HowToAdoptAPainting />} />
              <Route path="faqs" element={<FAQs />} />
              <Route path="after-adoption" element={<AfterAdoption />} />
              <Route path="art-conservators" element={<ArtConservators />} />
              <Route path="*" element={<Navigate replace to="/home" />} />
            </Route>
          </Routes>
      </div>
    </div>
  );
}

function Layout() {
  const location = useLocation();
  const defaultSelectedKey = location.pathname.split('/')[0];
  return (
    <div className="box wrapper">
      <div className="App-header header bg-[#193259]">
        Gordaneer Painting Adoption Project
      </div>
      <div className="box sidebar">
        <Menu
          style={{ width: 154 }}
          defaultSelectedKeys={[defaultSelectedKey]}
        >
          <Menu.Item key="home"><NavLink to="/home">Home</NavLink></Menu.Item>
          <Menu.Item key="gallery"><NavLink to="/gallery">Gallery</NavLink></Menu.Item>
          <Menu.Item key="about"><NavLink to="/about">Biography</NavLink></Menu.Item>
          <Menu.Item key="why-adopt"><NavLink to="/why-adopt">Why Adopt</NavLink></Menu.Item>
          <Menu.Item key="faqs"><NavLink to="/faqs">FAQs</NavLink></Menu.Item>
          <Menu.Item key="adopt"><NavLink to="/adopt">Adopt a Painting</NavLink></Menu.Item>
          <Menu.Item key="after-adoption"><NavLink to="/after-adoption">After Adoption</NavLink></Menu.Item>
          <Menu.Item key="art-conservators"><NavLink to="/art-conservators">Art Conservators</NavLink></Menu.Item>
        </Menu>
      </div>
      <div className="box content">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}

export default App;