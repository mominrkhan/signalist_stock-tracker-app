'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ALERT_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  FREQUENCY_OPTIONS,
} from '@/lib/constants';
import { createAlert, updateAlert } from '@/lib/actions/alert.actions';
import { toast } from 'sonner';

interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: {
    symbol: string;
    company: string;
  };
  alertToEdit?: Alert | null;
  onAlertUpdated?: () => void;
}

export function AlertModal({ open, onOpenChange, stock, alertToEdit, onAlertUpdated }: AlertModalProps) {
  const [alertName, setAlertName] = useState('');
  const [alertType, setAlertType] = useState('price');
  const [condition, setCondition] = useState('greater');
  const [threshold, setThreshold] = useState('');
  const [frequency, setFrequency] = useState('once_per_day');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (alertToEdit) {
      setAlertName(alertToEdit.alertName || '');
      setAlertType(alertToEdit.alertType || 'price');
      setCondition(alertToEdit.condition || 'greater');
      setThreshold(alertToEdit.threshold?.toString() || '');
      setFrequency(alertToEdit.frequency || 'once_per_day');
    } else {
      // Reset form when creating new
      setAlertName('');
      setAlertType('price');
      setCondition('greater');
      setThreshold('');
      setFrequency('once_per_day');
    }
  }, [alertToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!alertName.trim()) {
      toast.error('Please enter an alert name');
      return;
    }

    if (!threshold || parseFloat(threshold) <= 0) {
      toast.error('Please enter a valid threshold value');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      
      if (alertToEdit) {
        // Update existing alert
        result = await updateAlert(alertToEdit._id, {
          alertName: alertName.trim(),
          condition: condition as 'greater' | 'less',
          threshold: parseFloat(threshold),
          frequency,
        });

        if (result.success) {
          toast.success('Alert Updated', {
            description: `${alertName} has been updated successfully`,
          });
          onAlertUpdated?.();
        }
      } else {
        // Create new alert
        result = await createAlert({
          symbol: stock.symbol,
          company: stock.company,
          alertName: alertName.trim(),
          alertType: alertType as 'price',
          condition: condition as 'greater' | 'less',
          threshold: parseFloat(threshold),
          frequency,
        });

        if (result.success) {
          toast.success('Alert Created', {
            description: `${alertName} has been created successfully`,
          });
          onAlertUpdated?.();
        }
      }

      if (result.success) {
        // Reset form
        setAlertName('');
        setThreshold('');
        setAlertType('price');
        setCondition('greater');
        setFrequency('once_per_day');
        
        onOpenChange(false);
      } else {
        toast.error(`Failed to ${alertToEdit ? 'update' : 'create'} alert`, {
          description: result.error || 'Please try again',
        });
      }
    } catch (error) {
      toast.error(`Failed to ${alertToEdit ? 'update' : 'create'} alert`, {
        description: 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='alert-modal'>
        <DialogHeader>
          <DialogTitle className='alert-modal-title'>
            {alertToEdit ? 'Edit Price Alert' : 'Price Alert'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='alert-form'>
          <div className='alert-field'>
            <Label htmlFor='alertName' className='alert-label'>
              Alert Name
            </Label>
            <Input
              id='alertName'
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
              placeholder='eg: Apple at Discount!'
              className='alert-input'
              required
            />
          </div>

          <div className='alert-field'>
            <Label htmlFor='stockIdentifier' className='alert-label'>
              Stock Identifier
            </Label>
            <Input
              id='stockIdentifier'
              value={`${stock.company} (${stock.symbol})`}
              disabled
              className='alert-input-disabled'
            />
          </div>

          <div className='alert-field'>
            <Label htmlFor='alertType' className='alert-label'>
              Alert type
            </Label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger className='alert-select'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALERT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='alert-field'>
            <Label htmlFor='condition' className='alert-label'>
              Condition
            </Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger className='alert-select'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='alert-field'>
            <Label htmlFor='threshold' className='alert-label'>
              Threshold value
            </Label>
            <div className='alert-input-wrapper'>
              <span className='alert-input-prefix'>$</span>
              <Input
                id='threshold'
                type='number'
                step='0.01'
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder='eg: 140'
                className='alert-input-threshold'
                required
              />
            </div>
          </div>

          <div className='alert-field'>
            <Label htmlFor='frequency' className='alert-label'>
              Frequency
            </Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className='alert-select'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type='submit'
            className='alert-submit-btn'
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (alertToEdit ? 'Updating...' : 'Creating...') 
              : (alertToEdit ? 'Update Alert' : 'Create Alert')
            }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

