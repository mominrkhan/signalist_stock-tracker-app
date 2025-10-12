import Link from 'next/link';
import { formatTimeAgo } from '@/lib/utils';

interface WatchlistNewsProps {
  news: MarketNewsArticle[];
}

export function WatchlistNews({ news }: WatchlistNewsProps) {
  if (news.length === 0) {
    return (
      <div className='news-empty'>
        <p className='text-gray-400 text-sm'>No news available</p>
      </div>
    );
  }

  return (
    <div className='news-grid'>
      {news.map((article) => (
        <div key={article.id} className='news-card'>
          <div className='news-card-header'>
            <span className='news-badge'>{article.related || article.category}</span>
          </div>
          <h3 className='news-headline'>{article.headline}</h3>
          <div className='news-meta-row'>
            <span className='news-source'>{article.source}</span>
            <span className='news-separator'>•</span>
            <span className='news-time'>{formatTimeAgo(article.datetime)}</span>
          </div>
          <p className='news-summary'>{article.summary}</p>
          <Link
            href={article.url}
            target='_blank'
            rel='noopener noreferrer'
            className='news-read-more'
          >
            Read More →
          </Link>
        </div>
      ))}
    </div>
  );
}

