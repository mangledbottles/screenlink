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

export interface Account {
    isVerified: boolean;
    id: string;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean | null;
        image: string;
        currentProjectId: string;
    };
    lastUpdated: string;
}


export type Status = {
    type: string | null;
    message: string | null;
};

export interface Preference {
    name: string;
    value: string | boolean;
}

export const isProd = process.env.NODE_ENV != "development";
// export const isProd = true;
export const baseUrl = isProd ? "https://screenlink.io" : "http://localhost:3008";

export const logout = async () => {
    await window.electron.logout();
}

export const refreshDeviceCode = async () => {
    const newDeviceCode = await window.electron.getDeviceCode();
    return newDeviceCode;
};
