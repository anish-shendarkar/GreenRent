interface Listing {
    id: number;
    name: string;
    description: string;
    pricePerDay: number;
    advancePayment: number;
    available: boolean;
    imageUrl?: string | null;
}

interface ProfileType {
    name: string;
    email: string;
    phone: string;
    address: string;
}