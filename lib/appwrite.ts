import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";
import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import dummyData from "./data";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.jsm.foodordering",
  databaseId: "68629ae60038a7c61fe4",
  bucketId: "68643e170015edaa95d7",
  userCollectionId: "68629b0a003d27acb18f",
  categoriesCollectionId: "68643a390017b239fa0f",
  menuCollectionId: "68643ad80027ddb96920",
  customizationsCollectionId: "68643c0300297e5abc95",
  menuCustomizationsCollectionId: "68643cd8003580ecdd8f",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

// Optional: helper to normalize error messages
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const createUser = async ({ email, password, name }: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) {
      throw new Error("Failed to create account");
    }

    // Create a session immediately after sign up
    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    const userDoc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        email,
        name,
        accountId: newAccount.$id,
        avatar: avatarUrl,
      }
    );

    return userDoc;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session; // return it so caller can use it if needed
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw new Error("No current account found");
    }

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("User document not found");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(getErrorMessage(error));
  }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) {
      queries.push(Query.equal("categories", category));
      // If "categories" is an array attribute in Appwrite, you might want:
      // queries.push(Query.equal("categories", [category]));
    }

    if (query) {
      queries.push(Query.search("name", query));
    }

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    );

    return menus.documents;
  } catch (error) {
    // Fallback to local data when Appwrite is not available (e.g., project archived)
    try {
      let items = dummyData.menu.map((m, idx) => ({
        $id: `local-menu-${idx}`,
        name: m.name,
        description: m.description,
        image_url: m.image_url,
        price: m.price,
        rating: m.rating,
        calories: m.calories,
        protein: m.protein,
        type: m.category_name,
      }));

      // Category filter: if category id looks like our local one, derive the name
      if (category && category !== 'all') {
        let categoryName = category;
        if (category.startsWith('local-cat-')) {
          const found = dummyData.categories.find((c, i) => `local-cat-${i}` === category);
          categoryName = found ? found.name : category;
        }
        items = items.filter((i) => i.type?.toLowerCase() === categoryName.toLowerCase());
      }

      if (query) {
        const q = String(query).toLowerCase();
        items = items.filter((i) => i.name.toLowerCase().includes(q));
      }

      return items as any;
    } catch (e) {
      throw new Error(getErrorMessage(error));
    }
  }
};

export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId
    );

    return categories.documents;
  } catch (error) {
    // Fallback to local categories
    try {
      const categories = dummyData.categories.map((c, idx) => ({
        $id: `local-cat-${idx}`,
        name: c.name,
        description: c.description,
      }));
      return categories as any;
    } catch (e) {
      throw new Error(getErrorMessage(error));
    }
  }
};
