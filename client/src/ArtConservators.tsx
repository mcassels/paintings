import React from 'react';
import { Card, Spin } from 'antd';
import { useArtConservators } from './useArtConservators';
import Markdown from 'react-markdown';
import TextPage from './TextPage';
import { CARE_AND_CONSERVATION_KEY } from './constants';

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
    <div className="flex space-x-16">
      <TextPage textKey={CARE_AND_CONSERVATION_KEY} />
      <div className="w-[400px] space-y-4 text-left">
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