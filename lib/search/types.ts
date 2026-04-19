export type SearchGroup = "Leads" | "Help" | "Pages";

export type SearchRecord = {
  id: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  href: string;
};
