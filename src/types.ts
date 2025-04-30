export interface DeliveryOrder {
    id: string;
    restaurantName: string;
    restaurantAddress: string;
    ngoName: string;
    ngoAddress: string;
    restaurantLocation: [number, number];
    ngoLocation: [number, number];
    status: 'pending' | 'accepted' | 'picked' | 'delivered';
  }
  
  export interface DeliveryBoy {
    id: string;
    email: string;
    name: string;
  }