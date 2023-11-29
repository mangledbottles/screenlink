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