// ================= NAVBAR =================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}


// ================= SEARCH =================

const searchBtn = document.getElementById("searchBtn");
const searchContainer = document.getElementById("searchContainer");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");

if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        searchContainer.classList.add("active");

        if (searchInput) {
            searchInput.focus();
        }
    });
}

if (searchClose) {
    searchClose.addEventListener("click", () => {
        searchContainer.classList.remove("active");

        if (searchInput) {
            searchInput.value = "";
            applyFilters();
        }
    });
}


// ================= CART =================

const cartBtn = document.getElementById("cartBtn");
const cartClose = document.getElementById("cartClose");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let cart = [];

if (cartBtn) {
    cartBtn.addEventListener("click", () => {

        if (cartSidebar) {
            cartSidebar.classList.add("active");
        }

        if (cartOverlay) {
            cartOverlay.classList.add("active");
        }

    });
}

if (cartClose) {
    cartClose.addEventListener("click", closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
}

function closeCart() {

    if (cartSidebar) {
        cartSidebar.classList.remove("active");
    }

    if (cartOverlay) {
        cartOverlay.classList.remove("active");
    }

}


// ================= ADD TO CART =================

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const productCard = button.closest(".product-card");

        if (!productCard) return;

        const name =
            productCard.querySelector("h3")?.textContent.trim();

        const priceElement =
            productCard.querySelector(".product-bottom strong");

        if (!name || !priceElement) return;

        const priceText =
            priceElement.textContent.trim();

        const price =
            parseFloat(priceText.replace("$", ""));

        const existingProduct =
            cart.find(item => item.name === name);

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }

        updateCart();

        if (cartSidebar) {
            cartSidebar.classList.add("active");
        }

        if (cartOverlay) {
            cartOverlay.classList.add("active");
        }

    });

});


// ================= UPDATE CART =================

function updateCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <p>Your cart is empty</p>

                <span>Add products to see them here.</span>

            </div>
        `;

    } else {

        cart.forEach((item, index) => {

            const cartItem =
                document.createElement("div");

            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <div class="cart-item-icon">
                    <i class="fa-solid fa-bag-shopping"></i>
                </div>

                <div class="cart-item-info">

                    <h4>${item.name}</h4>

                    <p>
                        $${item.price.toFixed(2)}
                        × ${item.quantity}
                    </p>

                </div>

                <button
                    class="remove-item"
                    onclick="removeItem(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>
            `;

            cartItems.appendChild(cartItem);

        });

    }

    let total = 0;
    let quantity = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

        quantity += item.quantity;

    });

    if (cartTotal) {
        cartTotal.textContent =
            total.toFixed(2);
    }

    if (cartCount) {
        cartCount.textContent =
            quantity;
    }

}


// ================= REMOVE CART ITEM =================

function removeItem(index) {

    cart.splice(index, 1);

    updateCart();

}


// ================= CATEGORY + SEARCH FILTER =================

const categoryCards =
    document.querySelectorAll(".category-card");

const allProducts =
    document.querySelectorAll(".product-card");

let selectedCategory = "all";

categoryCards.forEach(card => {

    card.addEventListener("click", () => {

        selectedCategory =
            card.dataset.category;

        applyFilters();

        const productsSection =
            document.getElementById("products");

        if (productsSection) {

            productsSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});

function applyFilters() {

    const searchValue =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const categorySections =
        document.querySelectorAll(".product-category-section");

    categorySections.forEach(section => {

        const products =
            section.querySelectorAll(".product-card");

        let visibleCount = 0;

        products.forEach(product => {

            const nameElement =
                product.querySelector("h3");

            const productName =
                nameElement
                    ? nameElement.textContent.toLowerCase()
                    : "";

            const productCategory =
                product.dataset.category;

            const categoryMatch =
                selectedCategory === "all" ||
                productCategory === selectedCategory;

            const searchMatch =
                productName.includes(searchValue);

            if (categoryMatch && searchMatch) {

                product.style.display = "";
                visibleCount++;

            } else {

                product.style.display = "none";

            }

        });

        if (visibleCount > 0) {
            section.style.display = "";
        } else {
            section.style.display = "none";
        }

    });

}


// ================= SEARCH INPUT =================

if (searchInput) {

    searchInput.addEventListener("input", () => {

        applyFilters();

    });

}


// ================= WISHLIST =================

let wishlist = [];

const wishlistSidebar =
    document.getElementById("wishlistSidebar");

const wishlistOverlay =
    document.getElementById("wishlistOverlay");

const wishlistItems =
    document.getElementById("wishlistItems");

const wishlistClose =
    document.getElementById("wishlistClose");

const navbarWishlist =
    document.querySelector(".icon-btn.wishlist");


// ================= ADD / REMOVE WISHLIST =================

function addToWishlist(button) {

    const card =
        button.closest(".product-card");

    if (!card) return;

    const name =
        card.querySelector("h3")?.textContent.trim();

    // FIXED PRICE SELECTOR
    const price =
        card.querySelector(".product-bottom strong")
            ?.textContent.trim();

    const image =
        card.querySelector("img")?.src;

    if (!name || !price || !image) return;

    const existingIndex =
        wishlist.findIndex(
            item => item.name === name
        );

    const icon =
        button.querySelector("i");

    if (!icon) return;


    // REMOVE FROM WISHLIST

    if (existingIndex !== -1) {

        wishlist.splice(existingIndex, 1);

        button.classList.remove("liked");

        icon.classList.remove("fa-solid");

        icon.classList.add("fa-regular");

    }

    // ADD TO WISHLIST

    else {

        wishlist.push({

            name: name,

            price: price,

            image: image

        });

        button.classList.add("liked");

        icon.classList.remove("fa-regular");

        icon.classList.add("fa-solid");

    }

    updateWishlist();

}


// ================= PRODUCT HEARTS =================

document
    .querySelectorAll(".product-card .wishlist")
    .forEach(button => {

        button.addEventListener("click", function(event) {

            event.preventDefault();

            event.stopPropagation();

            addToWishlist(this);

        });

    });


// ================= DISPLAY WISHLIST =================

function updateWishlist() {

    if (!wishlistItems) return;

    if (wishlist.length === 0) {

        wishlistItems.innerHTML = `
            <p class="empty-wishlist">
                Your wishlist is empty ❤️
            </p>
        `;

        return;
    }


    wishlistItems.innerHTML =
        wishlist.map((product, index) => {

            return `
                <div class="wishlist-item">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div class="wishlist-item-info">

                        <h4>${product.name}</h4>

                        <p>${product.price}</p>

                    </div>

                    <button
                        class="remove-wishlist"
                        onclick="removeWishlist(${index})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>
            `;

        }).join("");

}


// ================= REMOVE WISHLIST =================

function removeWishlist(index) {

    const product =
        wishlist[index];

    if (!product) return;

    document
        .querySelectorAll(".product-card .wishlist")
        .forEach(button => {

            const card =
                button.closest(".product-card");

            const name =
                card.querySelector("h3")
                    ?.textContent.trim();

            if (name === product.name) {

                button.classList.remove("liked");

                const icon =
                    button.querySelector("i");

                if (icon) {

                    icon.classList.remove("fa-solid");

                    icon.classList.add("fa-regular");

                }

            }

        });


    wishlist.splice(index, 1);

    updateWishlist();

}


// ================= OPEN WISHLIST =================

if (navbarWishlist) {

    navbarWishlist.addEventListener("click", () => {

        if (wishlistSidebar) {
            wishlistSidebar.classList.add("active");
        }

        if (wishlistOverlay) {
            wishlistOverlay.classList.add("active");
        }

        updateWishlist();

    });

}


// ================= CLOSE WISHLIST =================

function closeWishlist() {

    if (wishlistSidebar) {
        wishlistSidebar.classList.remove("active");
    }

    if (wishlistOverlay) {
        wishlistOverlay.classList.remove("active");
    }

}

if (wishlistClose) {
    wishlistClose.addEventListener(
        "click",
        closeWishlist
    );
}

if (wishlistOverlay) {
    wishlistOverlay.addEventListener(
        "click",
        closeWishlist
    );
}


// ================= NEWSLETTER =================

const newsletterForm =
    document.getElementById("newsletterForm");

if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const email =
                document.getElementById("emailInput")?.value;

            alert(
                `Thank you! ${email} has been subscribed.`
            );

            newsletterForm.reset();

        }
    );

}


// ================= CHECKOUT =================

const checkoutBtn =
    document.querySelector(".checkout-btn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", () => {

        if (cart.length === 0) {

            alert(
                "Your cart is empty. Please add a product first."
            );

        } else {

            alert(
                "Checkout feature will be added in the backend."
            );

        }

    });

}


// ================= VIEW ALL =================

const viewAllBtn =
    document.getElementById("viewAllBtn");

if (viewAllBtn) {

    viewAllBtn.addEventListener("click", () => {

        selectedCategory = "all";

        if (searchInput) {
            searchInput.value = "";
        }

        applyFilters();

        const productsSection =
            document.getElementById("products");

        if (productsSection) {

            productsSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}


// ================= INITIAL =================

updateCart();

updateWishlist();