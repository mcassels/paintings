import React from 'react';
import './App.css';
import { usePaintings } from './usePaintings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PhotoGallery from './PhotoGallery';

const queryClient = new QueryClient();

function AppInner() {
  const paintings = usePaintings();
  console.log(paintings);
  // TODO: add filtering support
  // TODO: add timeline view

  return (
    <div>
      <div className="App flex flex-col justify-center h-max">
        <header className="App-header p-10">
          Paintings by James Gordaneer
        </header>
        {
          paintings === 'loading' ? (
            <div>Loading...</div>
          ) : paintings === 'error' ? (
            <div>Error loading paintings</div>
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
