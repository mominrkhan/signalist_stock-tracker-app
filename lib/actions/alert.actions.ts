'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '../better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Alert } from '@/database/models/alert.model';

// Create a new alert
export const createAlert = async (alertData: {
  symbol: string;
  company: string;
  alertName: string;
  alertType: 'price';
  condition: 'greater' | 'less';
  threshold: number;
  frequency: string;
}) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    const newAlert = new Alert({
      userId: session.user.id,
      symbol: alertData.symbol.toUpperCase(),
      company: alertData.company.trim(),
      alertName: alertData.alertName.trim(),
      alertType: alertData.alertType,
      condition: alertData.condition,
      threshold: alertData.threshold,
      frequency: alertData.frequency,
    });

    await newAlert.save();
    revalidatePath('/watchlist');

    return { success: true, message: 'Alert created successfully' };
  } catch (error) {
    console.error('Error creating alert:', error);
    throw new Error('Failed to create alert');
  }
};

// Delete an alert
export const deleteAlert = async (alertId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    await Alert.deleteOne({
      _id: alertId,
      userId: session.user.id,
    });

    revalidatePath('/watchlist');

    return { success: true, message: 'Alert deleted successfully' };
  } catch (error) {
    console.error('Error deleting alert:', error);
    throw new Error('Failed to delete alert');
  }
};

// Get user's alerts
export const getUserAlerts = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    const alerts = await Alert.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(alerts));
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw new Error('Failed to fetch alerts');
  }
};

// Get alerts for a specific symbol
export const getAlertsBySymbol = async (symbol: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    const alerts = await Alert.find({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(alerts));
  } catch (error) {
    console.error('Error fetching alerts by symbol:', error);
    throw new Error('Failed to fetch alerts');
  }
};

