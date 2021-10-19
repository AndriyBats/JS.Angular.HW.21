export interface IBlogRequest {
    title: string;
    text: string;
    date: Date;
    author: string;
}

export interface IBlogResponse {
    id: number;
    title: string;
    text: string;
    date: Date;
    author: string;
}