export type Species = {
  id: number;
  name: string;
  createdAt: string;
};

export type SpeciesListResponse = {
  success: boolean;
  data: Species[];
  errors?: Record<string, unknown>;
  code?: string;
  message?: unknown;
};

export type CreateSpeciesRequest = {
  name: string;
};

export type CreateSpeciesResponse = {
  success: boolean;
  data: Species;
  errors?: Record<string, unknown>;
  code?: string;
  message?: unknown;
};
