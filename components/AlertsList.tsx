'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteAlert } from '@/lib/actions/alert.actions';
import { AlertModal } from './AlertModal';
import { toast } from 'sonner';
import { formatPrice, formatChangePercent } from '@/lib/utils';
import Image from 'next/image';

interface AlertsListProps {
  alerts: Alert[];
}

interface StockPrice {
  price: number;
  change: number;
}

export function AlertsList({ alerts: initialAlerts }: AlertsListProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [stockPrices, setStockPrices] = useState<Record<string, StockPrice>>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [alertToEdit, setAlertToEdit] = useState<Alert | null>(null);

  useEffect(() => {
    // Fetch current prices for all alert symbols
    const fetchPrices = async () => {
      const prices: Record<string, StockPrice> = {};
      const apiKey = 'd3lfudhr01qq28enb7kgd3lfudhr01qq28enb7l0';
      
      for (const alert of alerts) {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${alert.symbol}&token=${apiKey}`
          );
          
          // Handle rate limit errors
          if (response.status === 429) {
            console.warn('⚠️ API rate limit reached. Stock prices may not be displayed.');
            break; // Stop trying to fetch more prices
          }
          
          if (!response.ok) {
            console.error(`Failed to fetch price for ${alert.symbol}: ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          
          if (data.c && data.dp !== undefined) {
            prices[alert.symbol] = {
              price: data.c,
              change: data.dp,
            };
          }
        } catch (error) {
          console.error(`Error fetching price for ${alert.symbol}:`, error);
        }
      }
      
      setStockPrices(prices);
    };

    if (alerts.length > 0) {
      fetchPrices();
    }
  }, [alerts]);

  const handleEdit = (alert: Alert) => {
    setAlertToEdit(alert);
    setEditModalOpen(true);
  };

  const handleAlertUpdated = () => {
    // Refresh the page to get updated alerts
    window.location.reload();
  };

  const handleDelete = async (alertId: string) => {
    try {
      const result = await deleteAlert(alertId);
      if (result.success) {
        setAlerts(alerts.filter((alert) => alert._id !== alertId));
        toast.success('Alert Deleted', {
          description: 'Alert has been removed successfully',
        });
      } else {
        toast.error('Failed to delete alert', {
          description: result.error || 'Please try again',
        });
      }
    } catch (error) {
      toast.error('Failed to delete alert', {
        description: 'Please try again later',
      });
    }
  };

  const handleImageError = (symbol: string) => {
    setImageErrors((prev) => ({ ...prev, [symbol]: true }));
  };

  const getConditionText = (condition: string) => {
    return condition === 'greater' ? '>' : '<';
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'once_per_day':
        return 'Once per day';
      case 'once_per_hour':
        return 'Once per hour';
      case 'real_time':
        return 'Real-time';
      default:
        return frequency;
    }
  };

  const getLogoUrl = (symbol: string) => {
    return `https://img.logo.dev/ticker/${symbol}?token=pk_X-1ZO13CQfat4p7iMLWYzQ`;
  };

  if (alerts.length === 0) {
    return (
      <div className='alerts-empty'>
        <p className='text-gray-400 text-sm'>No alerts created yet</p>
      </div>
    );
  }

  return (
    <div className='alerts-list'>
      {alerts.map((alert) => {
        const stockPrice = stockPrices[alert.symbol];
        
        return (
          <div key={alert._id} className='alert-card-new'>
            <div className='alert-top-row'>
              <div className='alert-logo-container'>
                {imageErrors[alert.symbol] ? (
                  <div className='alert-logo-fallback'>
                    {alert.symbol.charAt(0)}
                  </div>
                ) : (
                  <Image
                    src={getLogoUrl(alert.symbol)}
                    alt={`${alert.company} logo`}
                    width={48}
                    height={48}
                    className='alert-logo'
                    onError={() => handleImageError(alert.symbol)}
                  />
                )}
              </div>
              <div className='alert-company-section'>
                <h4 className='alert-company-name'>{alert.company}</h4>
                {stockPrice && (
                  <div className='alert-price-row'>
                    <span className='alert-price'>{formatPrice(stockPrice.price)}</span>
                  </div>
                )}
              </div>
              <div className='alert-symbol-section'>
                <span className='alert-symbol-text'>{alert.symbol}</span>
                {stockPrice && (
                  <span className={`alert-change ${stockPrice.change >= 0 ? 'positive' : 'negative'}`}>
                    {formatChangePercent(stockPrice.change)}
                  </span>
                )}
              </div>
            </div>
            
            <div className='alert-divider'></div>
            
            <div className='alert-bottom-section'>
              <div className='alert-info-row'>
                <div className='alert-condition-container'>
                  <span className='alert-label'>Alert:</span>
                  <span className='alert-condition-value'>
                    Price {getConditionText(alert.condition)} {formatPrice(alert.threshold)}
                  </span>
                </div>
                <div className='alert-actions-row'>
                  <button 
                    onClick={() => handleEdit(alert)}
                    className='alert-icon-btn' 
                    title='Edit alert'
                  >
                    <Pencil className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(alert._id)}
                    className='alert-icon-btn'
                    title='Delete alert'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
              <div className='alert-frequency-row'>
                <span className='alert-frequency-badge-new'>
                  {getFrequencyLabel(alert.frequency)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
      {alertToEdit && (
        <AlertModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          stock={{
            symbol: alertToEdit.symbol,
            company: alertToEdit.company,
          }}
          alertToEdit={alertToEdit}
          onAlertUpdated={handleAlertUpdated}
        />
      )}
    </div>
  );
}

