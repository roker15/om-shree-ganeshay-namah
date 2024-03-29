export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      events_registration: {
        Row: {
          id: number;
          created_at: string | null;
          profile_fk: string | null;
          name: string | null;
          mobile: string | null;
          event: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          profile_fk?: string | null;
          name?: string | null;
          mobile?: string | null;
          event?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          profile_fk?: string | null;
          name?: string | null;
          mobile?: string | null;
          event?: string | null;
        };
      };
      colleges: {
        Row: {
          id: number;
          created_at: string | null;
          college_name: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          college_name?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          college_name?: string | null;
        };
      };
      syllabus_moderator: {
        Row: {
          id: number;
          created_at: string | null;
          book_fk: number;
          moderator_fk: string | null;
          is_active: boolean;
          mobile: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          book_fk: number;
          moderator_fk?: string | null;
          is_active?: boolean;
          mobile?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          book_fk?: number;
          moderator_fk?: string | null;
          is_active?: boolean;
          mobile?: string | null;
        };
      };
      request: {
        Row: {
          id: number;
          created_at: string | null;
          message: string | null;
          mobile: string | null;
          user_fk: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          message?: string | null;
          mobile?: string | null;
          user_fk?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          message?: string | null;
          mobile?: string | null;
          user_fk?: string | null;
        };
      };
      books_board_or_university: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          name: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          name: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          name?: string;
        };
      };
      books: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          book_name: string;
          subject_fk: number | null;
          class_fk: number | null;
          board_or_university_fk: number | null;
          publication_fk: number | null;
          colleges_fk: number | null;
          syllabus_owner_fk: string | null;
          moderator: string[] | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          book_name: string;
          subject_fk?: number | null;
          class_fk?: number | null;
          board_or_university_fk?: number | null;
          publication_fk?: number | null;
          colleges_fk?: number | null;
          syllabus_owner_fk?: string | null;
          moderator?: string[] | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          book_name?: string;
          subject_fk?: number | null;
          class_fk?: number | null;
          board_or_university_fk?: number | null;
          publication_fk?: number | null;
          colleges_fk?: number | null;
          syllabus_owner_fk?: string | null;
          moderator?: string[] | null;
        };
      };
      books_article_sharing: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          books_subheadings_fk: number;
          shared_by: string | null;
          shared_with: string | null;
          owned_by: string;
          ispublic: boolean | null;
          allow_copy: boolean | null;
          allow_edit: boolean | null;
          sharedwith_email: string | null;
          ownedby_email: string | null;
          ownedby_name: string | null;
          ownedby_avatar: string | null;
          sharedwith_name: string | null;
          sharedwith_avatar: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          books_subheadings_fk: number;
          shared_by?: string | null;
          shared_with?: string | null;
          owned_by: string;
          ispublic?: boolean | null;
          allow_copy?: boolean | null;
          allow_edit?: boolean | null;
          sharedwith_email?: string | null;
          ownedby_email?: string | null;
          ownedby_name?: string | null;
          ownedby_avatar?: string | null;
          sharedwith_name?: string | null;
          sharedwith_avatar?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          books_subheadings_fk?: number;
          shared_by?: string | null;
          shared_with?: string | null;
          owned_by?: string;
          ispublic?: boolean | null;
          allow_copy?: boolean | null;
          allow_edit?: boolean | null;
          sharedwith_email?: string | null;
          ownedby_email?: string | null;
          ownedby_name?: string | null;
          ownedby_avatar?: string | null;
          sharedwith_name?: string | null;
          sharedwith_avatar?: string | null;
        };
      };
      books_articles: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          books_subheadings_fk: number;
          article_hindi: string | null;
          article_english: string | null;
          article_audio_link: string | null;
          created_by: string;
          article_title: string;
          sequence: number | null;
          copied_from_userid: string | null;
          copied_from_articleid: number | null;
          current_affair_tags: number[] | null;
          question_type: string | null;
          question_year: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          books_subheadings_fk: number;
          article_hindi?: string | null;
          article_english?: string | null;
          article_audio_link?: string | null;
          created_by: string;
          article_title: string;
          sequence?: number | null;
          copied_from_userid?: string | null;
          copied_from_articleid?: number | null;
          current_affair_tags?: number[] | null;
          question_type?: string | null;
          question_year?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          books_subheadings_fk?: number;
          article_hindi?: string | null;
          article_english?: string | null;
          article_audio_link?: string | null;
          created_by?: string;
          article_title?: string;
          sequence?: number | null;
          copied_from_userid?: string | null;
          copied_from_articleid?: number | null;
          current_affair_tags?: number[] | null;
          question_type?: string | null;
          question_year?: number | null;
        };
      };
      books_class: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          class: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          class: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          class?: string;
        };
      };
      books_headings: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          heading: string | null;
          books_fk: number | null;
          sequence: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          heading?: string | null;
          books_fk?: number | null;
          sequence?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          heading?: string | null;
          books_fk?: number | null;
          sequence?: number | null;
        };
      };
      books_publication: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          publication_name: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          publication_name: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          publication_name?: string;
        };
      };
      books_subheadings: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          subheading: string | null;
          books_headings_fk: number;
          sequence: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          subheading?: string | null;
          books_headings_fk: number;
          sequence?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          subheading?: string | null;
          books_headings_fk?: number;
          sequence?: number | null;
        };
      };
      countries: {
        Row: {
          id: number;
          name: string | null;
          iso2: string;
          iso3: string | null;
          local_name: string | null;
          continent: Database["public"]["Enums"]["continents"] | null;
        };
        Insert: {
          id?: number;
          name?: string | null;
          iso2: string;
          iso3?: string | null;
          local_name?: string | null;
          continent?: Database["public"]["Enums"]["continents"] | null;
        };
        Update: {
          id?: number;
          name?: string | null;
          iso2?: string;
          iso3?: string | null;
          local_name?: string | null;
          continent?: Database["public"]["Enums"]["continents"] | null;
        };
      };
      current_affair: {
        Row: {
          id: number;
          created_at: string | null;
          update_at: string | null;
          name: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          update_at?: string | null;
          name: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          update_at?: string | null;
          name?: string;
        };
      };
      current_affair_headings: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          heading: string | null;
          current_affair_fk: number | null;
          sequence: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          heading?: string | null;
          current_affair_fk?: number | null;
          sequence?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          heading?: string | null;
          current_affair_fk?: number | null;
          sequence?: number | null;
        };
      };
      current_affair_subheadings: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          subheading: string | null;
          current_affair_headings_fk: number;
          sequence: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          subheading?: string | null;
          current_affair_headings_fk: number;
          sequence?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          subheading?: string | null;
          current_affair_headings_fk?: number;
          sequence?: number | null;
        };
      };
      current_affair_tag: {
        Row: {
          id: number;
          created_at: string | null;
          tag_name: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          tag_name: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          tag_name?: string;
        };
      };
      exam: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          exame_name: string | null;
          state_or_central: string | null;
          regular_or_random: string | null;
          job_or_entrance: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          exame_name?: string | null;
          state_or_central?: string | null;
          regular_or_random?: string | null;
          job_or_entrance?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          exame_name?: string | null;
          state_or_central?: string | null;
          regular_or_random?: string | null;
          job_or_entrance?: string | null;
        };
      };
      headings: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          main_topic: string | null;
          paper_id: number | null;
          sequence: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          main_topic?: string | null;
          paper_id?: number | null;
          sequence?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          main_topic?: string | null;
          paper_id?: number | null;
          sequence?: number | null;
        };
      };
      papers: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          paper_name: string | null;
          is_multiple_subjects: boolean | null;
          exam_id: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          paper_name?: string | null;
          is_multiple_subjects?: boolean | null;
          exam_id?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          paper_name?: string | null;
          is_multiple_subjects?: boolean | null;
          exam_id?: number | null;
        };
      };
      posts: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          post: string | null;
          subheading_id: number | null;
          created_by: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          post?: string | null;
          subheading_id?: number | null;
          created_by?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          post?: string | null;
          subheading_id?: number | null;
          created_by?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          avatar_url: string | null;
          website: string | null;
          role: string | null;
          email: string | null;
          last_login: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          role?: string | null;
          email?: string | null;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          role?: string | null;
          email?: string | null;
          last_login?: string | null;
        };
      };
      question_answer: {
        Row: {
          id: number;
          created_at: string | null;
          question_id: number | null;
          answered_by: string | null;
          answer_hindi: string | null;
          answer_english: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          question_id?: number | null;
          answered_by?: string | null;
          answer_hindi?: string | null;
          answer_english?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          question_id?: number | null;
          answered_by?: string | null;
          answer_hindi?: string | null;
          answer_english?: string | null;
        };
      };
      questionbank: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          sequence: number | null;
          question_content: string | null;
          search_keys: string | null;
          year: number | null;
          paper_id: number | null;
          remark: string | null;
          created_by: string | null;
          paper_id_new: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          sequence?: number | null;
          question_content?: string | null;
          search_keys?: string | null;
          year?: number | null;
          paper_id?: number | null;
          remark?: string | null;
          created_by?: string | null;
          paper_id_new?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          sequence?: number | null;
          question_content?: string | null;
          search_keys?: string | null;
          year?: number | null;
          paper_id?: number | null;
          remark?: string | null;
          created_by?: string | null;
          paper_id_new?: number | null;
        };
      };
      questionbank_old: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          sequence: number | null;
          question_content: string | null;
          search_keys: string | null;
          year: number | null;
          paper_id: number | null;
          remark: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          sequence?: number | null;
          question_content?: string | null;
          search_keys?: string | null;
          year?: number | null;
          paper_id?: number | null;
          remark?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          sequence?: number | null;
          question_content?: string | null;
          search_keys?: string | null;
          year?: number | null;
          paper_id?: number | null;
          remark?: string | null;
          created_by?: string | null;
        };
      };
      sharedpost: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          post_id: number | null;
          shared_with: string | null;
          subheading_id: number | null;
          is_public: boolean | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          post_id?: number | null;
          shared_with?: string | null;
          subheading_id?: number | null;
          is_public?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          post_id?: number | null;
          shared_with?: string | null;
          subheading_id?: number | null;
          is_public?: boolean | null;
        };
      };
      subheadingquestionlink: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          created_by: string | null;
          subheading_id: number | null;
          questionbank_id: number | null;
          heading_id: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          created_by?: string | null;
          subheading_id?: number | null;
          questionbank_id?: number | null;
          heading_id?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          created_by?: string | null;
          subheading_id?: number | null;
          questionbank_id?: number | null;
          heading_id?: number | null;
        };
      };
      subheadings: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          topic: string | null;
          main_topic_id: number | null;
          sequence: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          topic?: string | null;
          main_topic_id?: number | null;
          sequence?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          topic?: string | null;
          main_topic_id?: number | null;
          sequence?: number | null;
        };
      };
      subjects: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          subject_name: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          subject_name: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          subject_name?: string;
        };
      };
      tree: {
        Row: {
          id: number;
          letter: string | null;
          path: unknown | null;
        };
        Insert: {
          id?: number;
          letter?: string | null;
          path?: unknown | null;
        };
        Update: {
          id?: number;
          letter?: string | null;
          path?: unknown | null;
        };
      };
      userfiles: {
        Row: {
          id: string;
          created_at: string | null;
          url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string | null;
          url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          url?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      fn_list: {
        Args: { vname: string };
        Returns: Record<string, unknown>[];
      };
      getPublicNotesListBySubheading: {
        Args: { subheadingid: number };
        Returns: Record<string, unknown>[];
      };
      getSharedNotesListBySubheading: {
        Args: { subheadingid: number; sharedwith: string };
        Returns: Record<string, unknown>[];
      };
      getSyllabusFromBookId: {
        Args: { bookid: number };
        Returns: Record<string, unknown>[];
      };
      getSyllabusFromBookIdRightJoinToGetAllHeading: {
        Args: { bookid: number };
        Returns: Record<string, unknown>[];
      };
      getSyllabusFromPaperId: {
        Args: { paperid: number };
        Returns: Record<string, unknown>[];
      };
      get_film_count: {
        Args: { len_from: number; len_to: number };
        Returns: number;
      };
      get_syllabus_from_id: {
        Args: { paperid: number };
        Returns: Record<string, unknown>[];
      };
      get_syllabus_from_paperid: {
        Args: { paperid: number };
        Returns: Record<string, unknown>[];
      };
      get_syllabus_from_paperidd: {
        Args: { paperid: number };
        Returns: Record<string, unknown>[];
      };
    };
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America";
      mood: "sad" | "ok" | "happy";
    };
  };
}

