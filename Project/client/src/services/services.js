import Api from '@/services/Api'

export default {
  fetchItems () {
    return Api().get('items')
  },

  addItem (params) {
    return Api().post('add_item', params)
  },

  updateItem (params) {
    return Api().put('items/' + params.id, params)
  },

  getItem (params) {
    return Api().get('item/' + params.id)
  },

  deleteItem (id) {
    return Api().delete('items/' + id)
  },

  deleteUser (id) {
    return Api().delete('users/' + id)
  },

  addUser (params) {
    return Api().post('users', params)
  },

  registerUser (params) {
    return Api().post('register/', params)
  },

  fetchUsers () {
    return Api().get('users')
  }
}
