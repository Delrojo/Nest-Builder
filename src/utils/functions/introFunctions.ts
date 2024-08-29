export interface BirthdayDTO {
  metadata: object;
  date: { year: number; month: number; day: number };
}

export interface GenderDTO {
  metadata: object;
  value: string;
  formattedValue?: string;
}

const findMostCompleteGender = (genders: GenderDTO[]): GenderDTO | null => {
  if (!genders || genders.length === 0) return null;

  return genders.reduce((mostComplete, current) => {
    const mostCompleteFields = Object.values(mostComplete).filter(
      (field) => field !== null && field !== undefined
    ).length;
    const currentFields = Object.values(current).filter(
      (field) => field !== null && field !== undefined
    ).length;

    return currentFields > mostCompleteFields ? current : mostComplete;
  }, genders[0]);
};

const findMostCompleteBirthday = (
  birthdays: BirthdayDTO[]
): BirthdayDTO | null => {
  if (!birthdays || birthdays.length === 0) return null;

  return birthdays.reduce((mostComplete, current) => {
    const mostCompleteFields = Object.values(mostComplete.date).filter(
      (field) => field !== null && field !== undefined
    ).length;
    const currentFields = Object.values(current.date).filter(
      (field) => field !== null && field !== undefined
    ).length;

    return currentFields > mostCompleteFields ? current : mostComplete;
  }, birthdays[0]);
};

const formatBirthday = (birthday: BirthdayDTO | null | undefined): string => {
  if (!birthday || !birthday.date) return "";

  const { year, month, day } = birthday.date;

  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day)
  ) {
    return "";
  }

  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDay}`;
};

const getAge = (birthDateString: string): number | string => {
  if (!birthDateString || isNaN(Date.parse(birthDateString))) {
    return "Invalid birth date string";
  }

  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
const snakeCaseToTitleCase = (str: string): string => {
  return str
    .split("_") // Split the string by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words with spaces
};

export {
  findMostCompleteGender,
  findMostCompleteBirthday,
  formatBirthday,
  getAge,
  snakeCaseToTitleCase,
};
