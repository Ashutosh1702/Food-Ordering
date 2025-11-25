import AsyncStorage from '@react-native-async-storage/async-storage';

export type LocalUser = {
  $id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type CreateUserParamsLocal = { name: string; email: string; password: string };
export type SignInParamsLocal = { email: string; password: string };

const USERS_KEY = 'auth_users';
const CURRENT_USER_KEY = 'auth_current_user';

const readUsers = async (): Promise<Array<LocalUser & { password: string }>> => {
  const json = await AsyncStorage.getItem(USERS_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
};

const writeUsers = async (users: Array<LocalUser & { password: string }>) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const createUser = async ({ name, email, password }: CreateUserParamsLocal) => {
  const users = await readUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error('User already exists');

  const newUser: LocalUser & { password: string } = {
    $id: Date.now().toString(),
    name,
    email,
    password,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
  };

  const updated = [...users, newUser];
  await writeUsers(updated);

  const { password: _pw, ...publicUser } = newUser;
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
  return publicUser;
};

export const signIn = async ({ email, password }: SignInParamsLocal) => {
  const users = await readUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!found) throw new Error('Invalid credentials');

  const { password: _pw, ...publicUser } = found;
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
  return publicUser;
};

export const signOut = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = async (): Promise<LocalUser | null> => {
  const json = await AsyncStorage.getItem(CURRENT_USER_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};
