export interface Comment {
    id: string;
    transformation_id: string;
    content: string;
    created_at: string;
    user_id: string;
    parent_id: string | null;
    profiles?: {
        full_name: string;
        avatar_url: string;
    };
    likes_count?: number; // Count of rows in comment_likes for this comment
    user_has_liked?: boolean; // Whether authorized user has liked this
}
