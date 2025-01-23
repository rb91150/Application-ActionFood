document.querySelector(".add-product-btn").addEventListener("click", () => {

    const productInput = document.getElementById("independent-product-input");

    const productName = productInput.value.trim();



    if (!productName) {

        alert("Veuillez entrer un nom de produit.");

        return;

    }



    const productList = document.getElementById("product-list");



    const li = document.createElement("li");

    li.innerHTML = `

        <span>${productName}</span>

        <button class="delete-btn">X</button>

    `;



    productList.appendChild(li);

    productInput.value = "";



    // Gérer la suppression

    li.querySelector(".delete-btn").addEventListener("click", () => {

        productList.removeChild(li);

    });

});