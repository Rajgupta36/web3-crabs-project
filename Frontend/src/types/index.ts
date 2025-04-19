export interface Heir {
  id: string;
  name: string;
  percentage: number;
  relationship: string;
  dateAdded: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  totalValue: number;
  currency: string;
  createdAt: string;
}