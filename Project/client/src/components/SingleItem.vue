/* eslint-disable */
<template>
  <b-container fluid>
    <b-row class="wrapper">
      <b-col>
        <b-carousel
          id="carousel-1"
          v-model="slide"
          :interval="4000"
          controls
          indicators
          style="text-shadow: 1px 1px 2px #333"
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
          v-if="item"
        >
          <b-card v-if="item && item.images.length === 0">
            <b-carousel-slide
              img-src="http://localhost:8081/images/no-image-icon-17.jpg_0"
            />
          </b-card>
          <b-card :key="item.images.length" v-if="item.images.length > 0">
            <b-carousel-slide
              :key="image"
              v-for="image in item.images"
              :text="(slide + 1).toString()"
              :img-src="`http://localhost:8081/images/${image}`"
            ></b-carousel-slide>
          </b-card>
        </b-carousel>
        <b-card v-if="editing || adding">
          <b-form-file
            type="file"
            v-model="file"
            :state="Boolean(file)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
          <div class="mt-3">Selected file: {{ file ? file.name : "" }}</div>
          <b-button v-if="!adding" @click="onUpload">Upload Image</b-button>
        </b-card>
      </b-col>
      <b-col>
        <b-card v-if="item && !editing">
          <b-card-body>
            <h1>{{ item.name }}</h1>
            <b-card-text>
              <b>Description:</b>
              {{ item.description }}
              <br />
              <b>Brand:</b>
              {{ item.brand }}
              <br />
              <b>Price:</b>
              {{ price }}
            </b-card-text>
          </b-card-body>
          <b-dropdown
            :key="chosenType"
            variant="outline-primary"
            :text="
              chosenType === null
                ? 'Choose item type'
                : this.item.attr[parseInt(chosenType)].type
            "
            id="dropdown-buttons"
            class="m-2"
          >
            <b-dropdown-item-button
              v-for="(type, index) in item.attr"
              :value="index"
              :key="type._id"
              @click="chooseType"
              v-b-tooltip.hover
              :title="'$' + type.price"
              :disabled="item.busAttr[index].quantity <= 0"
            >
              {{ type.type }}
            </b-dropdown-item-button>
          </b-dropdown>
          <div class="button-wrapper">
            <b-button
              variant="success"
              @click="addToCart"
              :disabled="chosenType === null"
            >
              Add to cart
            </b-button>
            <b-button variant="info" @click="populateForm">Edit Item</b-button>
          </div>
        </b-card>

        <b-card bg-variant="light" v-if="adding || editing">
          <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
              label-cols-sm="3"
              label="Name:"
              label-align-sm="right"
            >
              <b-form-input id="name" v-model="form.name"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Description:"
              label-align-sm="right"
            >
              <b-form-input id="description" v-model="form.description" />
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Brand:"
              label-align-sm="right"
            >
              <b-form-input id="brand" v-model="form.brand"></b-form-input>
            </b-form-group>

            <b-form-group
              v-for="(item, index) in form.attr"
              :key="index"
              label-cols-sm="3"
              :label="'Item ' + (index + 1)"
            >
              <b-form-group
                label-cols-sm="3"
                label="Type:"
                label-align-sm="right"
              >
                <b-form-input id="brand" v-model="item.type"></b-form-input>
              </b-form-group>
              <b-form-group
                label-cols-sm="3"
                label="Price:"
                label-align-sm="right"
              >
                <b-form-input type="number" v-model="item.price" />
              </b-form-group>
              <b-form-group
                label-cols-sm="3"
                label="Weight:"
                label-align-sm="right"
              >
                <b-form-input type="number" v-model="item.weight" />
              </b-form-group>
              <b-form-group
                label-cols-sm="3"
                label="Buying Price:"
                label-align-sm="right"
              >
                <b-form-input
                  type="number"
                  v-model="form.busAttr[index].buyPrice"
                />
              </b-form-group>
              <b-form-group
                label-cols-sm="3"
                label="Quantity:"
                label-align-sm="right"
              >
                <b-form-input
                  type="number"
                  v-model="form.busAttr[index].quantity"
                />
              </b-form-group>
            </b-form-group>
            <b-button variant="light" class="icon" @click="moreItem">
              <font-awesome-icon icon="plus-circle" size="2x" />
            </b-button>
            <b-button v-if="editing" @click="updateItem" variant="primary">
              Done Edit
            </b-button>
            <b-button v-if="editing" @click="deleteItem" variant="danger">
              Delete Item
            </b-button>
            <b-button
              v-if="editing"
              @click="editing = false"
              variant="secondary"
            >
              Back
            </b-button>
            <b-button v-if="adding" type="submit" variant="primary">
              Add Item
            </b-button>
            <b-button v-if="adding" type="reset" variant="danger">
              Reset
            </b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import services from "@/services/services";
let priceMin = data => {
  return data.reduce((min, b) => Math.min(min, b.price), data[0].price);
};
let priceMax = data => {
  return data.reduce((max, b) => Math.max(max, b.price), data[0].price);
};
export default {
  name: "singleItem",
  props: ["item", "adding"],
  data() {
    return {
      form: {
        name: "",
        description: "",
        brand: "",
        attr: [
          {
            price: "",
            weight: "",
            type: ""
          }
        ],
        busAttr: [
          {
            quantity: "",
            buyPrice: ""
          }
        ]
      },
      file: null,
      slide: 0,
      sliding: null,
      chosenType: null,
      price: "",
      editing: false
    };
  },
  beforeMount() {
    if (!this.item && !this.adding) {
      this.$router.go(-1);
    }
  },
  mounted() {
    if (this.item) {
      console.log(this.item);
      let minPrice = priceMin(this.item.attr);
      let maxPrice = priceMax(this.item.attr);
      if (minPrice === maxPrice) {
        this.price = "$" + minPrice.toString();
      } else {
        this.price = "$" + minPrice.toString() + " - $" + maxPrice.toString();
      }
    }
  },
  methods: {
    async updateItem() {
      let res = await services.updateItem({
        id: this.item._id,
        item: this.item
      });
      if (res.status === 200) {
        this.$swal("Item Updated", "", "success");
        this.item = res.data.item;
        this.editing = false;
      }
    },
    async deleteItem() {
      let res = await services.deleteItem(this.item._id);
      if (res.data.success) {
        console.log(res.data.item);
        this.$swal("Item Deleted", "", "success");
      }
    },
    async addToCart() {
      let res = await services.addToCart({
        username: localStorage.getItem("username"),
        itemId: this.item._id,
        itemIndex: parseInt(this.chosenType),
        quantity: 1
      });
      if (res.data.success) {
        this.$bvToast.toast(`Item added to cart`, {
          title: "Added to Cart",
          autoHideDelay: 500,
          variant: "success",
          appendToast: false
        });
      }
    },
    populateForm() {
      this.form = this.item;
      this.editing = true;
      console.log("editing true");
    },
    moreItem() {
      this.form.attr.push({
        price: "",
        weight: "",
        type: ""
      });
      this.form.busAttr.push({
        quantity: "",
        buyPrice: ""
      });
    },
    async onUpload() {
      var fd = new FormData();
      fd.append("img", this.file);
      let result = await services.uploadImage({
        formData: fd,
        id: this.item._id,
        filename: this.file.name
      });
      if (result.status === 201) {
        this.$swal("Success!", "", "success");
        if (!this.adding) {
          this.item.images.push(`${this.file.name}_${this.item._id}`);
        }
      } else this.$swal("Error!", result.data, "error");
    },
    async onSubmit(evt) {
      evt.preventDefault();
      try {
        let result = await services.addItem({ item: this.form });
        if (result.data.success) {
          if (this.file) {
            this.item = { _id: result.data.itemId };
            await this.onUpload();
          } else {
            this.$swal("Success", "", "success");
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    onReset(evt) {
      evt.preventDefault();
      this.form = {
        name: "",
        description: "",
        brand: "",
        attr: [
          {
            price: "",
            weight: "",
            type: ""
          }
        ],
        busAttr: [
          {
            quantity: "",
            buyPrice: ""
          }
        ]
      };
    },
    chooseType(e) {
      this.chosenType = e.target.value;
      this.price =
        "$" + this.item.attr[parseInt(this.chosenType)].price.toString();
    },
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
    }
  }
};
</script>

<style type="text/css" scoped>
.wrapper {
  margin: 20px;
}
.button-wrapper {
  margin-top: 100px;
}
.m-2 {
  display: block;
}
.icon {
  color: #2066d6;
  float: right;
}
</style>
