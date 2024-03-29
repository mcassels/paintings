import React from 'react';
import TextPage from './TextPage';
import { AFTER_ADOPTION_KEY } from './constants';
import { Link, NavLink } from 'react-router-dom';
import { Card, Space } from 'antd';
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
      <div className="text-lg font-bold text-left pb-10">Supporting Art Conservators</div>
      <div className="w-[650px] space-y-4 text-left">
        {
          conservators.map((conservator, index) => (
            <div key={index} className="flex-row justify-center">
              <Card title={conservator.name} extra={<a href={conservator.link}>Website</a>}>
                <Markdown>{conservator.bio}</Markdown>
              </Card>
            </div>
          ))
        }
      </div>
    </div>
  )
}