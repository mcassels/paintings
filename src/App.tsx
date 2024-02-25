import React from 'react';
import './App.css';
import { usePaintings } from './usePaintings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ImageGallery from 'react-image-gallery';
import { Painting } from './types';

const queryClient = new QueryClient();

interface GalleryProps {
  paintings: Painting[];
}

function Gallery(props: GalleryProps) {
  const { paintings } = props;
  debugger;
  return (
    <div>
      <ImageGallery
        items={paintings.map((p) => {
          return {
            original: p.imageUrl,
            thumbnail: p.imageUrl,
            description: p.name,
          };
        })}
      />
    </div>
  )
}

function AppInner() {
  const paintings = usePaintings();
  console.log(paintings);
  // TODO: add filtering support
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App flex flex-col justify-center h-max">
        <header className="App-header">
          Paintings by James Gordaneer
        </header>
        {
          paintings === 'loading' ? (
            <div>Loading...</div>
          ) : paintings === 'error' ? (
            <div>Error loading paintings</div>
          ) : <Gallery paintings={paintings} />
        }
      </div>
    </QueryClientProvider>
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
