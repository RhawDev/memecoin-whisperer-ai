
import React from 'react';
import TokenCard from './TokenCard';

const trendingTokensData = [
  {
    name: 'Dogecoin',
    ticker: '$DOGE',
    sentimentScore: 65,
    changePercentage: '+5%',
    socialMentions: 12500,
    mentionChange: '+12%'
  },
  {
    name: 'Shiba Inu',
    ticker: '$SHIB',
    sentimentScore: 42,
    changePercentage: '-8%',
    socialMentions: 9800,
    mentionChange: '-3%'
  },
  {
    name: 'Pepe',
    ticker: '$PEPE',
    sentimentScore: 78,
    changePercentage: '+15%',
    socialMentions: 14200,
    mentionChange: '+28%'
  },
  {
    name: 'Floki',
    ticker: '$FLOKI',
    sentimentScore: 53,
    changePercentage: '+2%',
    socialMentions: 5600,
    mentionChange: '+4%'
  }
];

const TrendingTokens: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {trendingTokensData.map((token, index) => (
        <TokenCard
          key={index}
          name={token.name}
          ticker={token.ticker}
          sentimentScore={token.sentimentScore}
          changePercentage={token.changePercentage}
          socialMentions={token.socialMentions}
          mentionChange={token.mentionChange}
        />
      ))}
    </div>
  );
};

export default TrendingTokens;
