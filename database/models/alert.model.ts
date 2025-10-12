import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface AlertItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  alertName: string;
  alertType: 'price';
  condition: 'greater' | 'less';
  threshold: number;
  frequency: string;
  createdAt: Date;
}

const AlertSchema = new Schema<AlertItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    alertName: { type: String, required: true, trim: true },
    alertType: { type: String, required: true, enum: ['price'], default: 'price' },
    condition: { type: String, required: true, enum: ['greater', 'less'] },
    threshold: { type: Number, required: true },
    frequency: { type: String, required: true, default: 'once_per_day' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Index for efficient queries
AlertSchema.index({ userId: 1, createdAt: -1 });

export const Alert: Model<AlertItem> =
  (models?.Alert as Model<AlertItem>) || model<AlertItem>('Alert', AlertSchema);

