export type Asset = {
  id: number;
  siteId: number;
  url: string;
  title: string;
  alt: string | null;
  status: 0 | 1 | 2;
};

export type MultiLanguageAsset = {
  [siteId: number]: Asset;
};

export type AssetsByAssetId = {
  [assetId: number]: MultiLanguageAsset;
};
