export interface CountryVisit {
  _id?: string;
  country: string;
  visits: number;
  lastVisit: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GovernorateVisit {
  _id?: string;
  governorate: string;
  visits: number;
  lastVisit: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AnalyticsSummary {
  totalCountries: number;
  totalGovernorates: number;
  totalVisits: number;
  totalEgyptVisits: number;
}

export interface VisitStatistics {
  totalVisits: number;
  totalEgyptVisits: number;
  countries: CountryVisit[];
  governorates: GovernorateVisit[];
  topCountries: CountryVisit[];
  topGovernorates: GovernorateVisit[];
}

export interface ProductClickStats {
  productId: string;
  title: string;
  clicks: number;
  imageUrl: string;
  lastClicked: Date;
}
