export type Exam = {
    id: number,
    created_at: string,
    updated_at: string,
    exam_name: string
}; 
export type Papers = {
    id: number,
    created_at?: string,
    updated_at?: string,
    paper_name?: string
    exam_id?: Exam|number,
};
export type Headings = {
    id: number,
    created_at?: string,
    updated_at?: string,
    main_topic?: string
    paper_id?:Papers|number
    sequence?:number
};
export type Subheading = {
    id: number,
    created_at?: string,
    updated_at?: string,
    topic?: string,
    main_topic_id?:Headings|number
    sequence?:number
};
export type Post = {
    id: number,
    created_at?: string,
    updated_at?: string,
    post?: string,
    subheading_id?:Subheading|number
    created_by?:string|Profile
};
export type Profile = {
    id: string,
    created_at?: string,
    updated_at?: string,
    email?: string,
    role?:string
};
export type SharedPost = {
    id: string,
    created_at: string,
    updated_at: string,
    post_id: Post|number,
    shared_with:Profile|string
    subheading_id:Subheading|number
};
export type QuestionBank = {
    id: number,
    created_at: string,
    updated_at: string,
    question_content?: string,
    search_keys?: string,
    year?: number,
    sequence?:number
    paper_id: Papers|number,
    remark: string,
};