export enum SourceType {
    SCREEN = "screen",
    WINDOW = "window",
}
export type Source = {
    id: string;
    name: string;
    thumbnail: string;
    dimensions: {
        width: number;
        height: number;
    };
    sourceType: SourceType;
    applicationName?: string;
};

export interface UploadLink {
    uploadLink: string;
    uploadId: string;
}

export interface MacWindow {
    pid: number;
    ownerName: string;
    name: string;
    width: number;
    height: number;
    x: number;
    y: number;
    number: number;
  }

export const isProd = process.env.NODE_ENV != "development";
// export const isProd = true;
export const baseUrl = isProd ? "https://screenlink.io" : "http://localhost:3008";