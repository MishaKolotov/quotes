export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  tags?: string[];
}

export interface QuoteResponse {
  _id?: string;
  id?: string;
  content?: string;
  text?: string;
  author?: string;
  authorSlug?: string;
  length?: number;
  tags?: string[];
  quote?: string;
}

