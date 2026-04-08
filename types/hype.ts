export interface HypeScore {
  label: string;
  score: number;
  githubScore: number;
  devtoScore: number;
}

export interface HypeDataPoint {
  language: string;
  hypeScore: number;
  githubScore: number;
  devtoScore: number;
  repoCount: number;
  articleCount: number;
}
