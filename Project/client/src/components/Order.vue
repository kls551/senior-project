<template>
  <div>
    <div v-if="isAdmin()">
      <b-button
        style="float: right; margin: 20px"
        @click="updateTax"
        pill
        variant="primary"
      >
        Update Tax
      </b-button>
      <b-form-input class="tax-form" v-model="tax" placeholder="Tax" />
    </div>

    <b-tabs content-class="mt-3" style="padding: 30px">
      <div style="text-align: center">
        <b-spinner
          style="display: inline-block"
          v-if="loading"
          variant="primary"
          type="grow"
          label="Spinning"
        ></b-spinner>
      </div>
      <b-tab title="All" active>
        <b-container fluid>
          <b-row />
          <b-row>
            <b-col>
              <b-card>
                <b-form-group label="Start Date:">
                  <datepicker
                    v-model="dateSelected.startDate"
                    @closed="getItems"
                  />
                </b-form-group>
                <b-form-group label="End Date:">
                  <datepicker
                    v-model="dateSelected.endDate"
                    @closed="getItems"
                  />
                </b-form-group>
              </b-card>
            </b-col>
            <b-col cols="8">
              <b-table
                v-if="!loading"
                head-variant="dark"
                :items="orders"
                :fields="fields"
              >
                <template v-slot:cell(show_details)="row">
                  <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                    {{ row.detailsShowing ? "Hide" : "Show" }} Details
                  </b-button>
                </template>

                <template v-slot:row-details="row">
                  <b-table
                    class="table-dark"
                    :items="row.item.table"
                    :fields="innerFields"
                  />
                </template>
              </b-table>
            </b-col>
            <b-col />
          </b-row>
        </b-container>
      </b-tab>
      <b-tab title="Monthly" @click="getAggregate('month')">
        <b-table
          hover
          class="table-wrap"
          v-if="!loading"
          head-variant="dark"
          :items="aggOrders"
          :fields="aggFields"
          @row-clicked="getItemsByMonth"
        />
      </b-tab>
      <b-tab title="Yearly" @click="getAggregate('year')">
        <b-table
          hover
          class="table-wrap"
          v-if="!loading"
          head-variant="dark"
          :items="aggOrders"
          :fields="aggFields"
          @row-clicked="getItemsByYear"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import services from "@/services/services";
import Datepicker from "vuejs-datepicker";

export default {
  data() {
    return {
      tax: parseFloat(localStorage.getItem("tax")),
      aggOrders: [],
      aggFields: [
        {
          key: "_id.month",
          label: "Month",
          sortable: true,
          formatter: this.monthFormatter
        },
        { key: "_id.year", label: "Year", sortable: true },
        { key: "totalAmount", label: "Sales", sortable: true },
        { key: "revenue", sortable: true }
      ],
      dateSelected: {
        startDate: new Date(2019, 0, 1),
        endDate: new Date()
      },
      fields: [
        { key: "seller.name", label: "Cashier", sortable: true },
        {
          key: "orderDate",
          sortable: true,
          formatter: value => value.toDateString()
        },
        { key: "orderTime", sortable: true },
        { key: "totalAmount", sortable: true },
        { key: "revenue", sortable: true },
        "show_details"
      ],
      items: [],
      orders: [],
      loading: false,
      innerFields: [
        "name",
        "type",
        { key: "price", sortable: true },
        { key: "quantity", sortable: true },
        { key: "itemTotal", sortable: true }
      ]
    };
  },
  mounted() {
    this.getItems();
  },
  components: {
    Datepicker
  },
  methods: {
    isAdmin() {
      return localStorage.getItem("admin") === "true";
    },
    monthFormatter(value) {
      let month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      return month[value - 1];
    },
    getItemsByYear(order) {
      this.$router.push({
        name: "orderAgg",
        path: `/order/aggregate`,
        params: { order: order, year: true }
      });
    },
    getItemsByMonth(order) {
      this.$router.push({
        name: "orderAgg",
        path: `/order/aggregate`,
        params: { order: order }
      });
    },
    async updateTax() {
      let res = await services.editTax({ tax: this.tax });
      console.log(res.data);
      if (res.data.updated) {
        this.$bvToast.toast("Tax updated", {
          title: "Updated",
          toaster: "b-toaster-top-center",
          autoHideDelay: 500,
          variant: "success",
          appendToast: false
        });
        localStorage.setItem("tax", this.tax);
      }
    },
    async getAggregate(agg) {
      this.loading = true;
      if (agg === "month") {
        let monthLabel = this.aggFields[0].label === "Month";
        if (!monthLabel) {
          this.aggFields.unshift({
            key: "_id.month",
            label: "Month",
            sortable: true
          });
        }
      } else if (agg === "year") {
        this.aggFields = this.aggFields.filter(item => item.label !== "Month");
      }
      let result = await services.fetchAggSales(agg);
      this.aggOrders = result.data;
      this.loading = false;
    },
    processData(data) {
      let new_data = JSON.parse(JSON.stringify(data));
      new_data.forEach(order => {
        let orderDate = new Date(order.orderDate);
        order.orderDate = orderDate;
        order.orderTime =
          orderDate.getHours().toString() +
          ":" +
          orderDate.getMinutes().toString();
        order.items.forEach(item => {
          let info = {
            name: item.item.name,
            type: item.item.attr[item.index].type,
            price: item.price,
            quantity: item.quantity,
            itemTotal: item.price * item.quantity
          };
          if (!order.table) {
            order.table = [info];
          } else {
            order.table.push(info);
          }
        });
      });
      return new_data;
    },
    async getItems() {
      this.loading = true;
      const response = await services.fetchOrders(this.dateSelected);
      this.orders = this.processData(response.data);
      this.loading = false;
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
.tax-form {
  float: right;
  width: 100px;
  margin: 20px;
  margin-right: 0px;
}
</style>
