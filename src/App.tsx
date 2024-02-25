import React from 'react';
import { zoomies } from 'ldrs'
import './App.css';
import { usePaintings } from './usePaintings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PhotoGallery from './PhotoGallery';

const queryClient = new QueryClient();

function AppInner() {
  const paintings = usePaintings();

  zoomies.register()

  return (
    <div>
      <div className="App flex flex-col justify-center h-max">
        <header className="App-header">
          Paintings by Jim Gordaneer
        </header>
        {
          paintings === 'loading' ? (
            <div className="loading">
              <l-zoomies/>
            </div>
          ) : paintings === 'error' ? (
            <div className="loading">Error loading paintings</div>
          ) : <PhotoGallery paintings={paintings} />
        }
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
