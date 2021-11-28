const url = "http://localhost:8080";

new Vue({
  el: "#app",
  data: {
    filterType: 'all',
    orders: [],
  },
  methods: {
    fetchAllOrders() {
      axios.get(url + '/orders')
        .then(response => {
          this.orders = response.data.map(order => ({
            ...order,
            created: (new Date(order.created)).toLocaleString(),
          }));
        })
        .catch( error => console.log(error));
    },
    getFilteredOrders() {
      if (this.filterType === 'all') {
        return this.orders;
      }

      return this.orders.filter(order => order.type === this.filterType);
    }
  },
  mounted() {
    this.fetchAllOrders();
  },
});

