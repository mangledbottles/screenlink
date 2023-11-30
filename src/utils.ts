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
};

export const isProd = process.env.NODE_ENV != "development";
// export const isProd = true;
export const baseUrl = isProd ? "https://screenlink.io" : "http://localhost:3008";