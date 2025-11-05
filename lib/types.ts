export type ClipboardType = {
    id: string,
    type:  "text" | "image" | "link",
    content:string,
    timestamp:Date,
    isFavorite: boolean
}


