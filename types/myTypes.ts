
export type Exam = {
  id: number;
  created_at: string;
  updated_at: string;
  exam_name: string;
};
export type Papers = {
  id: number;
  created_at?: string;
  updated_at?: string;
  paper_name?: string;
  exam_id?: Exam | number;
};
export type Headings = {
  id: number;
  created_at?: string;
  updated_at?: string;
  main_topic?: string;
  paper_id?: Papers | number;
  sequence?: number;
};
export type Subheading = {
  id: number;
  created_at?: string;
  updated_at?: string;
  topic?: string;
  main_topic_id?: Headings | number;
  sequence?: number;
};
export type Post = {
  id: number;
  created_at?: string;
  updated_at?: string;
  post?: string;
  subheading_id?: Subheading | number;
  created_by?: string | Profile;
};
export type Profile = {
  id: string;
  created_at?: string;
  updated_at?: string;
  email?: string;
  role?: string;
};
export type SharedPost = {
  id: string;
  created_at: string;
  updated_at: string;
  post_id: Post | number;
  shared_with: Profile | string;
  subheading_id: Subheading | number;
  is_public: boolean;
};
export type QuestionBank = {
  id: number;
  created_at: string;
  updated_at: string;
  question_content?: string;
  search_keys?: string;
  year?: number;
  sequence?: number;
  paper_id: Papers | number;
  remark: string;
  created_by: string | Profile;
};
export type SubheadingQuestionLink = {
  id: number;
  created_at?: string;
  updated_at?: string;

  heading_id?: Headings | number;
  questionbank_id?: QuestionBank | number;
  subheading_id?: Subheading | number;

  created_by: string | Profile;
};

export type SubheadingViews = {
  subheading_id: number;
  main_topic_id?: number;
  topic?: string;
  subheading_sequence?: number;
  heading_id?: number;
  main_topic?: string;
  heading_sequence?: number;
  paper_id?: number;
};

export type BookResponse = {
  id: number;
  book_name?: string;
  class_fk?: {
    id: number;
    class: string;
  };
  subject_fk?: {
    id: number;
    subject_name: string;
  };
  publication_fk?: number;
};
  export interface BookResponse1 {
    bookId: number;
    bookName: string;
    colleges_fk?: number | null| undefined;
    syllabus_owner_fk?: string | null| undefined;
    moderator?: string[] | null | undefined;
    publication_fk?: number | null| undefined;
  }


export type BookSyllabus = {
  subheading_id: number;
  subheading: string;
  subheading_sequence: number;
  heading_id: number;
  heading: string;
  heading_sequence: number;
  book_id: number;
  book_name: string;
};
