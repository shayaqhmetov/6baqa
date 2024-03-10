export interface iPost {
    id: number;
    attributes: iPostAttributes;
}

export interface iPostAttributes {
    title: string;
    description: string;
    imageUrl: string;
    slug: string;
}