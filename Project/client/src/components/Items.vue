<template>
  <div>
    <div class="table-wrap">
      <b-button
        style="float: left; margin-bottom: 20px"
        @click="addItem"
        pill
        variant="primary"
      >
        Add Item
      </b-button>
    </div>
    <div class="table-wrap">
      <b-table
        hover
        bordered
        head-variant="dark"
        :items="items"
        :fields="fields"
        @row-clicked="showItem"
      >
        <template v-slot:cell(show_details)="row">
          <b-button size="sm" @click="row.toggleDetails" class="mr-2">
            {{ row.detailsShowing ? "Hide" : "Show" }} Details
          </b-button>
        </template>

        <template v-slot:row-details="row">
          <b-card>
            <b-row>
              <table class="full-table table table-striped table-dark">
                <thead>
                  <tr>
                    <td>Weight</td>
                    <td>Type</td>
                    <td>Price</td>
                    <td>Quantity</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(attr, index) in row.item.attr" :key="attr._id">
                    <td>{{ attr.weight }}</td>
                    <td>{{ attr.type }}</td>
                    <td>{{ attr.price }}</td>
                    <td>{{ row.item.busAttr[index].quantity }}</td>
                  </tr>
                </tbody>
              </table>
            </b-row>
          </b-card>
        </template>
      </b-table>
      <!-- <div class="items">
      <h1>Items</h1>
      <div v-if="items.length > 0" class="table-wrap">
        <div>
          <router-link v-bind:to="{ name: 'additem' }" class>Add Item</router-link>
        </div>
        <table>
          <tr>
            <td>Name</td>
            <td width="550">Description</td>
            <td>Brand</td>
            <td>Attr</td>
            <td>BusAttr</td>
            <td width="100" align="center">Action</td>
          </tr>
          <tr v-for="item in items" :key="item._id">
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.brand }}</td>
            <td>
              <table>
                <tr>
                  <td>Weight</td>
                  <td>Type</td>
                  <td>Price</td>
                </tr>
                <tr v-for="(attr) in item.attr" :key="attr">
                  <td>{{attr.weight}}</td>
                  <td>{{attr.type}}</td>
                  <td>{{attr.price}}</td>
                </tr>
              </table>
            </td>
            <td>
              <table>
                <tr>
                  <td>Quantity</td>
                </tr>
                <tr v-for="(attr) in item.busAttr" :key="attr">
                  <td>{{attr.quantity}}</td>
                </tr>
              </table>
            </td>

            <td align="center">
              <router-link v-bind:to="{ name: 'edititem', params: { id: item._id } }">Edit</router-link>|
              <a href="#" @click="deleteItem(item._id)">Delete</a>
            </td>
          </tr>
        </table>
      </div>
      <div v-else>
        There are no items.. Lets add one now
        <br />
        <br />
        <router-link v-bind:to="{ name: 'additem' }" class="add_item_link">Add Item</router-link>
      </div>
      </div>-->
      <!-- <img id='img' :src="`http://localhost:8081/images/${src}`"> -->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import services from "@/services/services";
export default {
  name: "items",
  data() {
    return {
      fields: [
        { key: "name", sortable: true },
        "description",
        { key: "brand", sortable: true },
        "show_details"
      ],
      items: [],
      src: "5cc8b04ea8373c3ec4daf54b"
    };
  },
  mounted() {
    this.getItems();
  },
  methods: {
    addItem() {
      this.$router.push({
        name: "singleItem",
        path: `/item`,
        params: { adding: true }
      });
    },
    showItem(item) {
      this.$router.push({
        name: "singleItem",
        path: `/item/${item.id}`,
        params: { item: item }
      });
    },
    console() {
      console.log(this.file);
      const fd = new FormData();
      fd.append("img", this.file);
      console.log(fd);
    },
    // async onUpload () {
    //   var fd = new FormData()
    //   fd.append('img', this.file)
    //   let result = await services.uploadImage({
    //     formData: fd,
    //     id: '5cc8b04ea8373c3ec4daf54b',
    //     filename: this.file.name
    //   })
    //   if (result.status === 201) this.$swal('Success!', '', 'success')
    //   else this.$swal('Error!', result.data, 'error')
    // },
    async getItems() {
      const response = await services.fetchItems();
      this.items = response.data.items;
    },
    async deleteItem(id) {
      this.$swal({
        name: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(function() {
        services.deleteItem(id);
        $this.$router.go({
          path: "/"
        });
      });
    },
    async updateItem() {
      await services.updateItem({
        id: this.$route.params.id,
        name: this.name,
        description: this.description,
        brand: this.brand
      });
      this.$swal("Great!", `Your item has been updated!`, "success");
      this.$router.push({ name: "Items" });
    }
  }
};
</script>
<style type="text/css" scoped>
.table-wrap {
  width: 60%;
  margin: 0 auto;
  text-align: center;
  margin-top: 20px;
}
.full-table {
  margin: 20px;
  width: 100%;
}
.button {
  align-items: left;
}
</style>
