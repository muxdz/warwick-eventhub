export type Society = {
    id: number;
    society_name: string;
    created_at: Date;
}

export type SocietyCreate = {
    society_name: string;
}