declare type Asset = {
  id: number;
  siteId: number | null;
  url: string;
  title: string;
  alt: string | null;
};

declare type MultiLanguageAsset = {
  [siteId: number]: Asset;
};

declare type AssetsByAssetId = {
  [assetId: number]: MultiLanguageAsset;
};
