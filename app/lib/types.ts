export type Diary = {
  uid?: string;  
  id: string;
  title: string;
  content: string;
  date?: string;
  createdAt?: string;
  image?: string | null;
  tags?: string[];
};

export type Study = {
  uid?: string;  
  id: string;
  title: string;
  content?: string;
  summary?: string;
  date?: string;
  createdAt?: string;
  image?: string | null;
  tags?: string[];
};

export type TabKey = 'diary' | 'study';
