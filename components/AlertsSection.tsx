'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertsList } from './AlertsList';
import { AlertModal } from './AlertModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AlertsSectionProps {
  alerts: Alert[];
  watchlistStocks: Array<{ symbol: string; company: string }>;
  showHeader?: boolean;
  renderCreateButton?: boolean;
}

export function AlertsSection({ 
  alerts, 
  watchlistStocks, 
  showHeader = true,
  renderCreateButton = true 
}: AlertsSectionProps) {
  const [showStockSelector, setShowStockSelector] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; company: string } | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const handleCreateAlert = () => {
    if (watchlistStocks.length === 0) {
      return;
    }
    
    if (watchlistStocks.length === 1) {
      // If only one stock, open alert modal directly
      setSelectedStock(watchlistStocks[0]);
      setShowAlertModal(true);
    } else {
      // Show stock selector
      setShowStockSelector(true);
    }
  };

  const handleStockSelect = (symbol: string) => {
    const stock = watchlistStocks.find((s) => s.symbol === symbol);
    if (stock) {
      setSelectedStock(stock);
      setShowStockSelector(false);
      setShowAlertModal(true);
    }
  };

  const handleAlertModalClose = (open: boolean) => {
    setShowAlertModal(open);
    if (!open) {
      setSelectedStock(null);
    }
  };

  const handleAlertCreated = () => {
    // Refresh the page to show the new alert
    window.location.reload();
  };

  // If only rendering the create button (for header)
  if (renderCreateButton && !showHeader) {
    return (
      <>
        <Button 
          className="create-alert-btn"
          onClick={handleCreateAlert}
          disabled={watchlistStocks.length === 0}
        >
          Create Alert
        </Button>

        {/* Stock Selector Dialog */}
        <Dialog open={showStockSelector} onOpenChange={setShowStockSelector}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Stock for Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Select onValueChange={handleStockSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a stock from your watchlist" />
                </SelectTrigger>
                <SelectContent>
                  {watchlistStocks.map((stock) => (
                    <SelectItem key={stock.symbol} value={stock.symbol}>
                      {stock.company} ({stock.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>

        {/* Alert Modal */}
        {selectedStock && (
          <AlertModal
            open={showAlertModal}
            onOpenChange={handleAlertModalClose}
            stock={selectedStock}
            onAlertUpdated={handleAlertCreated}
          />
        )}
      </>
    );
  }

  // If only rendering the list (no header)
  if (!showHeader && !renderCreateButton) {
    return (
      <>
        <AlertsList alerts={alerts} />

        {/* Stock Selector Dialog */}
        <Dialog open={showStockSelector} onOpenChange={setShowStockSelector}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Stock for Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Select onValueChange={handleStockSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a stock from your watchlist" />
                </SelectTrigger>
                <SelectContent>
                  {watchlistStocks.map((stock) => (
                    <SelectItem key={stock.symbol} value={stock.symbol}>
                      {stock.company} ({stock.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>

        {/* Alert Modal */}
        {selectedStock && (
          <AlertModal
            open={showAlertModal}
            onOpenChange={handleAlertModalClose}
            stock={selectedStock}
            onAlertUpdated={handleAlertCreated}
          />
        )}
      </>
    );
  }

  // Default: render full section with header
  return (
    <>
      <div className="alerts-section">
        {showHeader && (
          <div className="section-header">
            <h3 className="section-title">Alerts</h3>
            {renderCreateButton && (
              <Button 
                className="create-alert-btn"
                onClick={handleCreateAlert}
                disabled={watchlistStocks.length === 0}
              >
                Create Alert
              </Button>
            )}
          </div>
        )}
        <AlertsList alerts={alerts} />
      </div>

      {/* Stock Selector Dialog */}
      <Dialog open={showStockSelector} onOpenChange={setShowStockSelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Stock for Alert</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select onValueChange={handleStockSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a stock from your watchlist" />
              </SelectTrigger>
              <SelectContent>
                {watchlistStocks.map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    {stock.company} ({stock.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Modal */}
      {selectedStock && (
        <AlertModal
          open={showAlertModal}
          onOpenChange={handleAlertModalClose}
          stock={selectedStock}
          onAlertUpdated={handleAlertCreated}
        />
      )}
    </>
  );
}

