import $axios from "@/axios";

export const fetchUserResources = async (): Promise<string[]> => {
  try {
    const response = await $axios.get("/permission/resources");
    return response.data.result.map((resource: any) => resource.name);
  } catch (error) {
    throw error;
  }
};
