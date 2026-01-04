export interface Comment {
    id: string;
    transformation_id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
        full_name: string;
        avatar_url: string;
    };
}
