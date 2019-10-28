import Api from "@/services/Api";
// import axios from 'axios'

export default {
  fetchItems() {
    return Api().get("items");
  },

  addItem(params) {
    return Api().post("item", params);
  },

  updateItem(params) {
    return Api().put("items/" + params.id, params);
  },

  getItem(params) {
    return Api().get("item/" + params.id);
  },

  deleteItem(id) {
    return Api().delete("items/" + id);
  },

  deleteUser(id) {
    return Api().delete("users/" + id);
  },

  addUser(params) {
    return Api().post("users", params);
  },

  registerUser(params) {
    return Api().post("register/", params);
  },

  fetchUsers() {
    return Api().get("users");
  },

  uploadImage(params) {
    return Api().post(
      `images/${params.id}?filename=${params.filename}`,
      params.formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  addToCart(params) {
    return Api().put(`cart/${params.username}`, params);
  },

  getCart(params) {
    return Api().get(`cart/${params.username}`);
  },

  getUser(params) {
    return Api().get(`user/${params.username}`);
  },

  order(params) {
    return Api().post(`order`, params);
  },

  fetchOrders() {
    return Api().get("orders");
  }
};
