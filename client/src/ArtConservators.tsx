import React from 'react';
import { Card, Spin } from 'antd';
import { useArtConservators } from './useArtConservators';
import Markdown from 'react-markdown';

export default function ArtConservators() {
  const conservators = useArtConservators();
  if (conservators === 'loading') { // TODO: reusable component for loading and error
    return (
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Spin />
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
              <Card title={conservator.name}>
                <Markdown>{conservator.bio}</Markdown>
              </Card>
            </div>
          ))
        }
      </div>
    </div>
  )
}