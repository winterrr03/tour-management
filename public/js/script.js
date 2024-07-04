const sliderMain = document.querySelector(".sliderMain");
if (sliderMain) {
  const swiper = new Swiper(".sliderMain", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

// alert-add-cart-susscess
const alertAddCartSusscess = () => {
  const elementAlert = document.querySelector("[alert-add-cart-susscess]");
  if (elementAlert) {
    elementAlert.classList.remove("alert-hidden");

    setTimeout(() => {
      elementAlert.classList.add("alert-hidden");
    }, 3000);

    const closeAlert = elementAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
      elementAlert.classList.add("alert-hidden");
    });
  }
};
// End alert-add-cart-susscess

// Hiển thị số lượng vào mini cart
const showMiniCart = () => {
  const miniCart = document.querySelector("[mini-cart]");
  if (miniCart) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    miniCart.innerHTML = cart.length;
  }
};
showMiniCart();
// Hết Hiển thị số lượng vào mini cart

// Cart
// Khởi tạo giỏ hàng
const cart = localStorage.getItem("cart");
if (!cart) {
  localStorage.setItem("cart", JSON.stringify([]));
}

// Thêm tour vào giỏ hàng
const formAddToCart = document.querySelector("[form-add-to-cart]");
if (formAddToCart) {
  formAddToCart.addEventListener("submit", (event) => {
    event.preventDefault();

    const quantity = parseInt(formAddToCart.quantity.value);
    const tourId = parseInt(formAddToCart.getAttribute("tour-id"));

    if (quantity > 0 && tourId) {
      const cart = JSON.parse(localStorage.getItem("cart"));

      const indexExistTour = cart.findIndex((item) => item.tourId == tourId);

      if (indexExistTour == -1) {
        cart.push({
          tourId: tourId,
          quantity: quantity,
        });
      } else {
        cart[indexExistTour].quantity =
          cart[indexExistTour].quantity + quantity;
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      showMiniCart();

      alertAddCartSusscess();
    }
  });
}
// End Cart

// Hiển thị data ra giỏ hàng
const tableCart = document.querySelector("[table-cart]");
if (tableCart) {
  fetch("/cart/list-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: localStorage.getItem("cart"),
  })
    .then((res) => res.json())
    .then((data) => {
      const htmlArray = data.cart.map(
        (item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>
              <img 
                src="${item.infoTour.image}" 
                alt="${item.infoTour.title}" 
                width="80px"
              >
            </td>
            <td>
              <a href="/tours/detail/${item.infoTour.slug}">
                ${item.infoTour.title}
              </a>
            </td>
            <td>${item.infoTour.price_special.toLocaleString()}đ</td>
            <td>
              <input 
                type="number" 
                name="quantity" 
                value="${item.quantity}" 
                min="1" 
                item-id="${item.tourId}" 
                style="width: 60px"
              >
            </td>
            <td>${item.infoTour.total.toLocaleString()}đ</td>
            <td>
              <button 
                class="btn btn-sm btn-danger" 
                btn-delete="${item.tourId}"
              >
                Xóa
              </button>
            </td>
          </tr>
      `
      );

      const tbody = tableCart.querySelector("tbody");
      tbody.innerHTML = htmlArray.join("");

      const elementTotalPrice = document.querySelector("[total-price]");
      elementTotalPrice.innerHTML = data.total.toLocaleString();
    });
}
// Hết Hiển thị data ra giỏ hàng
