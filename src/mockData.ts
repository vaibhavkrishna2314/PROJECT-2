import { DeliveryOrder } from './types';

export const mockOrders: DeliveryOrder[] = [
  {
    id: '1',
    restaurantName: 'Geetha Hospitality',
    restaurantAddress: 'UPES Kandoli Campus, Dehradin (248007)',
    ngoName: 'Human Society International',
    ngoAddress: 'BalluPur, Dehradun ',
    restaurantLocation: [30.383467, 77.969228], // Bangalore City Center
    ngoLocation: [30.271089,  78.046494], // Nearby location
    status: 'pending'
  },
  {
    id: '2',
    restaurantName: 'Shetty & Sons',
    restaurantAddress: 'Bidholi, Dehradun via premnagar',
    ngoName: 'Helping Hands',
    ngoAddress: '321 Pine St, Westside',
    restaurantLocation: [30.415846, 77.967661], // Indiranagar
    ngoLocation: [30.271089,  78.046494], // Nearby location
    status: 'pending'
  },
  {
    id: '3',
    restaurantName: 'Bidholi Adda',
    restaurantAddress: 'Bidholi, Dehradun via premnagar',
    ngoName: 'HSI',
    ngoAddress: 'Premnagar, Dehradun',
    restaurantLocation: [30.415846, 77.967661], // Indiranagar
    ngoLocation: [30.271089,  78.046494], // Nearby location
    status: 'pending'
  }
];