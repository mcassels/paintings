import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PhotoGallery from './PhotoGallery';
import { NavLink, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AboutJamesGordaneer from './AboutJamesGordaneer';
import HowToAdoptAPainting from './HowToAdoptAPainting';

const queryClient = new QueryClient();

function AppInner() {
  return (
    <div>
      <div className="App flex flex-col justify-center h-max">
        <header className="App-header">
          Paintings by Jim Gordaneer
        </header>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="gallery" />} />
              <Route path="gallery" element={<PhotoGallery />} />
              <Route path="about" element={<AboutJamesGordaneer />} />
              <Route path="adopt" element={<HowToAdoptAPainting />} />
              <Route path="*" element={<Navigate replace to="/gallery" />} />
            </Route>
          </Routes>
      </div>
    </div>
  );
}

function Layout() {
  return (
    <div>
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
          <MenuItem component={<NavLink to="/about" />}> About James Gordaneer</MenuItem>
          <MenuItem component={<NavLink to="/adopt" />}> Adopt a Painting</MenuItem>
        </Menu>
      </Sidebar>
      <Outlet />
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