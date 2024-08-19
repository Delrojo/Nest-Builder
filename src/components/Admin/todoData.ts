export interface TodoItem {
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  pagePath: string;
}

export type TodoList = TodoItem[];

export const todoList: TodoList = [
  {
    title: "Firestore Delete",
    description: "Figure out how to do firestore delete",
    status: "To Do",
    priority: "High",
    pagePath: "src/utils/functions/authFunctions.ts",
  },
  {
    title: "Admin UI",
    description: "Create an admin dashboard",
    status: "In Progress",
    priority: "Low",
    pagePath: "src/pages/admin-dashboard.tsx",
  },
  {
    title: "Onboarding AI Function",
    description: "Create a function that sends onboarding profile information",
    status: "To Do",
    priority: "Medium",
    pagePath: "src/pages/api/onboarding.ts",
  },
  {
    title: "Check Getting Extra Info",
    description: "Can we get birthday and gender?",
    status: "Completed",
    priority: "Medium",
    pagePath: "src/pages/api/fetchExtraUserInformation.ts",
  },
  {
    title: "Organize All Constants",
    description: "Organize all constants in one folder",
    status: "To Do",
    priority: "Low",
    pagePath: "src/utils/constants.ts",
  },
  {
    title: "Organize All Functions",
    description: "Organize all functions in one folder or in the api",
    status: "To Do",
    priority: "Low",
    pagePath: "src/utils/functions",
  },
];
