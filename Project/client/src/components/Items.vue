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
    quantityProcess(items) {
      items.forEach(item => {
        let lowQ = item.busAttr.find(field => field.quantity < 10);
        if(lowQ) {
          item._rowVariant = "danger"
        }
      });
    },
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
    async getItems() {
      const response = await services.fetchItems();
      this.quantityProcess(response.data.items);
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
