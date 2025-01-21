import { ConfigProvider } from 'antd';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PhotoGallery from './pages/PhotoGallery';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import * as AdoptionPages from './adoption/pages';
import Biography from './pages/Biography';
import AdoptionLayout from './adoption/AdoptionLayout';
import HomeLayout from './components/CatalogLayout';

const queryClient = new QueryClient();


// TODO: lazy-load adoption pages
function AppRouter() {
  return (
    <Routes>
      <Route path="adoption" element={<AdoptionLayout />}>
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
        <Route path="*" element={<Navigate replace to="home" />} />
      </Route>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<AdoptionPages.LandingPage />} />
        <Route path="gallery" element={<PhotoGallery />} />
        <Route path="about" element={<Biography />} />
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Route>
    </Routes>
  );
}

function AppInner() {
  return (
    <div>
      <div className="App">
        <BrowserRouter>
          <AppRouter />
       </BrowserRouter>
      </div>
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