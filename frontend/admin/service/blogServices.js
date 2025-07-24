import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/blogs`;

const getBlogsAdmin = async () => {
  const response = await axios.get(`${API_URL}/admin/`);
  return response.data.blogs;
};

const createBlog = async (formData, token) => {
  const response = await axios.post(API_URL, formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const updateBlog = async (id, formData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const deleteBlog = async (id, token) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export { getBlogsAdmin, createBlog, updateBlog, deleteBlog };
