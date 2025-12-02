export type Asset = {
  id: number;
  siteId: number | null;
  url: string;
  title: string;
  alt: string | null;
};

export type MultiLanguageAsset = {
  [siteId: number]: Asset;
};

export type AssetsByAssetId = {
  [assetId: number]: MultiLanguageAsset;
};
