interface Listing {
    id: number;
    name: string;
    description: string;
    pricePerDay: number;
    advancePayment: number;
    available: boolean;
    imageUrl?: string | null;
    ownerId: number;
    ownerPhone?: string | null;
    ownerName?: string | null;
}

interface ProfileType {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface Rental {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  listing: Listing;
}