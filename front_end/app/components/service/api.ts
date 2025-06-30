import $axios from "@/axios";

export const fetchUserResources = async () => {
  try {
    const response = await $axios.get("/permission/resources");
    return response.data.result;
  } catch (error) {
    console.error("Failed to fetch permissions:", error);
    throw error;
  }
};
