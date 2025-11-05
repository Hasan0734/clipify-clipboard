export type ClipboardType = {
    id: string,
    type:  "text" | "image" | "link",
    content:string,
    timestamp:string,
    isFavorite: boolean
}