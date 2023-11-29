import { Metadata } from "next";
type OpenGraphType = "article" | "website" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other";

export function constructMetadata({
    title = 'ScreenLink - Open Source Loom Alternative',
    description = "ScreenLink is an open-source Loom alternative that allows you to record and share your screen with ease using our desktop app.",
    type = "website",
}: Partial<{
    title: string,
    description: string,
    type: OpenGraphType,
}>): Metadata {

    return {
        title,
        description,
        openGraph: {
            description,
            siteName: "ScreenLink",
            type,
            // TODO: Add images
            // images: [
            //     {
            //         url: "https://screenlink.app/images/og-image.png",
            //         width: 1200,
            //         height: 630,
            //         alt: "ScreenLink",
            //     },
            // ],
        },
        robots: {
            follow: true,
            index: true,
        },
    }

}