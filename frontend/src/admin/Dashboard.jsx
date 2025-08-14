- import axios from 'axios';
- import { API_URL } from '../api';
+ import api from '../api';

  const fetchArticles = async () => {
    try {
-     const res = await axios.get(`${API_URL}/api/articles`);
+     const res = await api.get(`/api/articles`); // إذا route محمي زيد headers: authHeader()
      setArticles(res.data);
    } catch (err) {
      console.error('Erreur de récupération :', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('contenu', contenu);
      if (image) formData.append('image', image); // ⚠️ اسم الحقل "image"

-     if (editId) {
-       await axios.put(`${API_URL}/api/articles/${editId}`, formData, {
-         headers: { 'Content-Type': 'multipart/form-data', ...authHeader() },
-       });
+     const cfg = { headers: { ...authHeader() } }; // لا تضيف Content-Type هنا
+     if (editId) {
+       await api.put(`/api/articles/${editId}`, formData, cfg);
        setMessage('✅ Article modifié !');
      } else {
-       await axios.post(`${API_URL}/api/articles`, formData, {
-         headers: { 'Content-Type': 'multipart/form-data', ...authHeader() },
-       });
+       await api.post(`/api/articles`, formData, cfg);
        setMessage('✅ Article ajouté !');
      }

      setTitre('');
      setContenu('');
      setImage(null);
      setEditId(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
      fetchArticles();
    } catch (err) {
      console.error(err);
      setMessage('❌ Une erreur est survenue.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('❗ Supprimer cet article ?')) return;
-   await axios.delete(`${API_URL}/api/articles/${id}`, { headers: authHeader() });
+   await api.delete(`/api/articles/${id}`, { headers: authHeader() });
    fetchArticles();
  };
