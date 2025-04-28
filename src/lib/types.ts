import { z } from 'zod';

export const foodTypes = [
  'Prepared Meals',
  'Fruits & Vegetables',
  'Bakery',
  'Dairy',
  'Meat & Poultry',
  'Seafood',
  'Dry Goods',
  'Beverages',
  'Other'
] as const;

export const foodListingSchema = z.object({
  name: z.string().min(1, 'Food item name is required'),
  foodType: z.enum(foodTypes, {
    errorMap: () => ({ message: 'Please select a food type' })
  }),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  expiryDate: z.date()
    .min(new Date(), 'Expiry date must be in the future')
    .transform(date => date.toISOString()),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  pickupInstructions: z.string().min(1, 'Pickup instructions are required'),
  storageInstructions: z.string().optional(),
  allergens: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export type FoodListingForm = z.infer<typeof foodListingSchema>;