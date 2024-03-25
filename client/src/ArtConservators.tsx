import React from 'react';
import TextPage from './TextPage';
import { AFTER_ADOPTION_KEY } from './constants';
import { Link, NavLink } from 'react-router-dom';
import { useArtConservators } from './useArtConservators';
import { zoomies } from 'ldrs';
import Markdown from 'react-markdown';

export default function ArtConservators() {
  const conservators = useArtConservators();
  if (conservators === 'loading') { // TODO: reusable component for loading and error
    zoomies.register();
    return (
      <div className="loading">
        <l-zoomies/>
      </div>
    );
  }
  if (conservators === 'error') {
    return <div className="loading">Error loading Conservators</div>;
  }
  return (
    <div>
      <div className="text-lg font-bold pb-2">Supporting Art Conservators</div>
      <div className="w-[650px]">
        {
          conservators.map((conservator, index) => (
            <div key={index} className="flex-row justify-center">
              <div className="w-[650px]">
                <div className="text-lg font-bold pb-2">{conservator.name}</div>
                <Markdown>{conservator.bio}</Markdown>
                <Link to={conservator.link}>Website</Link>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}