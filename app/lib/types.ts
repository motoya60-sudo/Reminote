export type Diary = {
  uid:string;  
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
};

export type Study = {
  uid: string;  
  id: string;
  title: string;
  summary: string;
  date: string;
  tags?: string[];
};

export type TabKey = 'diary' | 'study';
