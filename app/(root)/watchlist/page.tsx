import { Star } from 'lucide-react';
import { searchStocks, getNews } from '@/lib/actions/finnhub.actions';
import SearchCommand from '@/components/SearchCommand';
import { getWatchlistWithData } from '@/lib/actions/watchlist.actions';
import { getUserAlerts } from '@/lib/actions/alert.actions';
import { WatchlistTable } from '@/components/WatchlistTable';
import { AlertsSection } from '@/components/AlertsSection';
import { WatchlistNews } from '@/components/WatchlistNews';

const Watchlist = async () => {
  const watchlist = await getWatchlistWithData();
  const initialStocks = await searchStocks();

  // Empty state
  if (watchlist.length === 0) {
    return (
      <section className="flex watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Start building your watchlist by searching for stocks and clicking the star icon to add them.
          </p>
        </div>
        <SearchCommand initialStocks={initialStocks} />
      </section>
    );
  }

  // Fetch alerts and news for populated watchlist
  const alerts = await getUserAlerts();
  const watchlistSymbols = watchlist.map((item: StockWithData) => item.symbol);
  const news = await getNews(watchlistSymbols);
  
  // Prepare watchlist stocks for alert creation
  const watchlistStocks = watchlist.map((item: StockWithData) => ({
    symbol: item.symbol,
    company: item.company,
  }));

  return (
    <section className="watchlist-page">
      {/* Unified Header */}
      <div className="watchlist-unified-header">
        <div className="watchlist-header-left">
          <h2 className="watchlist-title">Watchlist</h2>
          <SearchCommand initialStocks={initialStocks} label="Add Stock" />
        </div>
        <div className="watchlist-header-right">
          <h2 className="watchlist-title">Alerts</h2>
          <AlertsSection 
            alerts={alerts} 
            watchlistStocks={watchlistStocks}
            showHeader={false}
            renderCreateButton={true}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="watchlist-grid">
        {/* Left Column - Watchlist Table */}
        <div className="watchlist-main">
          <WatchlistTable watchlist={watchlist} />
        </div>

        {/* Right Column - Alerts */}
        <div className="watchlist-sidebar">
          <AlertsSection 
            alerts={alerts} 
            watchlistStocks={watchlistStocks}
            showHeader={false}
            renderCreateButton={false}
          />
        </div>
      </div>

      {/* News Section */}
      <div className="news-section">
        <h3 className="section-title">News</h3>
        <WatchlistNews news={news} />
      </div>
    </section>
  );
};

export default Watchlist;

