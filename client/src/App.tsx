import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PhotoGallery from './PhotoGallery';
import { NavLink, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import HowToAdoptAPainting from './HowToAdoptAPainting';
import FAQs from './FAQs';
import TextPage from './TextPage';
import { JIM_BIO_KEY } from './constants';
import WhyAdopt from './WhyAdopt';
import AfterAdoption from './AfterAdoption';
import ArtConservators from './ArtConservators';

const queryClient = new QueryClient();

function AppInner() {
  return (
    <div>
      <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="gallery" />} />
              <Route path="gallery" element={<PhotoGallery />} />
              <Route path="about" element={<TextPage textKey={JIM_BIO_KEY} />} />
              <Route path="why-adopt" element={<WhyAdopt />} />
              <Route path="adopt" element={<HowToAdoptAPainting />} />
              <Route path="faqs" element={<FAQs />} />
              <Route path="after-adoption" element={<AfterAdoption />} />
              <Route path="art-conservators" element={<ArtConservators />} />
              <Route path="*" element={<Navigate replace to="/gallery" />} />
            </Route>
          </Routes>
      </div>
    </div>
  );
}

function Layout() {
  return (
    <div className="box wrapper">
      <div className="App-header header">
        James Gordaneer Damaged Paintings Adoption Project
      </div>
      <div className="box sidebar">
        <Sidebar>
          <Menu
            menuItemStyles={{
              button: {
                [`&.active`]: {
                  backgroundColor: '#13395e',
                  color: '#b6c8d9',
                },
              },
            }}
          >
            <MenuItem component={<NavLink to="/gallery" />}> Gallery</MenuItem>
            <MenuItem component={<NavLink to="/about" />}> Biography</MenuItem>
            <MenuItem component={<NavLink to="/why-adopt" />}> About this project</MenuItem>
            <MenuItem component={<NavLink to="/faqs" />}> FAQs</MenuItem>
            <MenuItem component={<NavLink to="/adopt" />}> Adopt a Painting</MenuItem>
            <MenuItem component={<NavLink to="/after-adoption" />}> After Adoption</MenuItem>
            <MenuItem component={<NavLink to="/art-conservators" />}> Art Conservators</MenuItem>
          </Menu>
        </Sidebar>
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