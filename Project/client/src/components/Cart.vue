<template>
  <div class="card-wrapper">
    <div v-if="!(cart && cart.length)" style="align-items: center">
      <h3 style="color: gray">No Item in Cart</h3>
    </div>
    <div v-if="cart && cart.length">
      <b-button
        :disabled="disableUpdate"
        variant="primary"
        size="lg"
        pill
        @click="updateCart"
      >
        Update Cart
      </b-button>
      <b-card
        :key="cartItem.item.quantity"
        v-for="cartItem in cart"
        style="margin-top: 20px;"
        no-body
        class="overflow-hidden"
      >
        <b-row no-gutters>
          <b-col md="3">
            <b-card-img
              :src="`http://localhost:8081/images/${cartItem.item.images[0]}`"
              class="rounded-0"
            ></b-card-img>
          </b-col>
          <b-col md="7">
            <b-card-body :title="cartItem.item.name">
              <b-card-text>
                <span>{{ cartItem.item.attr[cartItem.index].type }}</span>
              </b-card-text>
            </b-card-body>
          </b-col>
          <b-col align-self="center">
            <b-form-group
              label-cols-sm="7"
              label="Quantity:"
              label-class="font-weight-bold pt-0"
            >
              <b-form-input
                style="width: 50px;"
                size="sm"
                type="number"
                min="0"
                v-model="cartItem.quantity"
                @change="checkDiff"
              ></b-form-input>
            </b-form-group>
            <div>
              <b>Price:</b>
              ${{
                cartItem.item.attr[cartItem.index].price * cartItem.quantity
              }}
            </div>
          </b-col>
        </b-row>
      </b-card>
      <h4 style="float:right;margin-top:20px">
        <b>Total Price:</b>
        ${{ totalPrice }}
      </h4>
      <b-button
        style="margin-top: 20px"
        variant="primary"
        size="lg"
        pill
        @click="order"
      >
        CheckOut
      </b-button>
    </div>
  </div>
</template>

<script>
import services from "@/services/services";

export default {
  data() {
    return {
      disableUpdate: true,
      originalCart: null,
      cart: null,
      totalPrice: 0,
      revenue: 0,
      updatedItems: []
    };
  },
  async mounted() {
    await this.getCart();
  },
  methods: {
    async order() {
      let body = {
        sellerName: localStorage.getItem("username"),
        orderDate: "",
        revenue: this.revenue,
        totalAmount: this.totalPrice,
        items: this.cart
      };
      console.log(body);
      try {
        let res = await services.order(body);
        if (res) {
          this.$swal("Order added!", "", "success");
        }
      } catch (err) {
        console.log(err.response);
      }
    },
    async getCart() {
      this.disableUpdate = true;
      let result = await services.getCart({
        username: localStorage.getItem("username")
      });
      this.cart = result.data.cart;
      this.originalCart = JSON.parse(JSON.stringify(result.data.cart));
      this.getTotal();
      console.log(this.cart);
      console.log(this.revenue);
    },
    async updateCart() {
      this.cart.forEach((item, index) => {
        if (parseInt(item.quantity) !== this.originalCart[index].quantity) {
          this.updatedItems.push({
            username: localStorage.getItem("username"),
            itemId: item.item._id,
            itemIndex: item.index,
            quantity:
              parseInt(item.quantity) - this.originalCart[index].quantity
          });
        }
      });
      this.updatedItems.forEach(async item => {
        await this.addToCart(item);
      });
      this.getCart();
    },
    async addToCart(item) {
      let res = await services.addToCart(item);
      if (res.data.success) {
        this.$bvToast.toast(`Cart item updated`, {
          title: "Added to Cart",
          autoHideDelay: 5000,
          variant: "success",
          appendToast: false
        });
      }
    },
    checkDiff() {
      let dif = this.disableUpdate;
      this.getTotal();
      this.cart.forEach((item, index) => {
        if (parseInt(item.quantity) !== this.originalCart[index].quantity) {
          dif = false;
        }
      });
      this.disableUpdate = dif;
    },
    getTotal() {
      let total = 0;
      let buyTotal = 0;
      this.cart.forEach(cartItem => {
        total += cartItem.item.attr[cartItem.index].price * cartItem.quantity;
        buyTotal +=
          cartItem.item.busAttr[cartItem.index].buyPrice * cartItem.quantity;
        cartItem.price = cartItem.item.attr[cartItem.index].price;
      });
      this.totalPrice = total;
      this.revenue = total - buyTotal;
    }
  }
};
</script>

<style scoped>
.card-wrapper {
  margin-top: 50px;
  margin-left: 200px;
  margin-right: 200px;
}
</style>
