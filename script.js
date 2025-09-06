const gallery = document.querySelector(".gallery");

const filtersContainer = document.createElement("div");
filtersContainer.classList.add("filters-container");
gallery.parentNode.insertBefore(filtersContainer, gallery);

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const loginLink = document.getElementById("login_link");

  if (token && loginLink) {
    loginLink.textContent = "logout";
    loginLink.href = "#";
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.reload();
    });
  }

  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      afficherProjets(data);
      genererFiltres(data);

      if (token) {
        const filters = document.querySelector(".filters-container");
        if (filters) {
          filters.style.display = "none";
        }

        function afficherBandeauEdition() {
          if (document.getElementById("bandeau-edition")) return;

          const bandeau = document.createElement("div");
          bandeau.id = "bandeau-edition";
          bandeau.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i>
    <span>Mode édition</span>
  `;

          bandeau.style.position = "fixed";
          bandeau.style.top = "0";
          bandeau.style.left = "0";
          bandeau.style.width = "100%";
          bandeau.style.height = "40px";
          bandeau.style.backgroundColor = "black";
          bandeau.style.color = "white";
          bandeau.style.display = "flex";
          bandeau.style.alignItems = "center";
          bandeau.style.justifyContent = "center";
          bandeau.style.gap = "8px";
          bandeau.style.zIndex = "1000";
          bandeau.style.fontSize = "14px";

          document.body.prepend(bandeau);
        }
        const token = localStorage.getItem("token");

        if (token) {
          afficherBandeauEdition();
        }
        const titre = document.getElementById("modifier_projets");
        const wrapper = document.createElement("div");
        wrapper.classList.add("modifier");

        const btnEdit = document.createElement("button");
        btnEdit.classList.add("btn_modifier");
        btnEdit.innerHTML =
          '<i class="fa-regular fa-pen-to-square"></i> Modifier';

        titre.parentNode.insertBefore(wrapper, titre);
        wrapper.appendChild(titre);
        wrapper.appendChild(btnEdit);

        const modal = document.getElementById("modal");
        const closeModal = document.querySelector(".modal_content_close");

        btnEdit.addEventListener("click", () => {
          modal.classList.remove("hidden");
          afficherImagesDansModale(data);
        });

        closeModal.addEventListener("click", () => {
          modal.classList.add("hidden");
        });
      }
    });
  modal.addEventListener("click", (e) => {
    const modalContent = document.querySelector(".modal_content");
    if (!modalContent.contains(e.target)) {
      modal.classList.add("hidden");
    }
  });
});

// ****importé les projets****
function afficherProjets(projets) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  projets.forEach((projet) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = projet.title;

    const caption = document.createElement("figcaption");
    caption.textContent = projet.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

// **** création de mes filtres****
function genererFiltres(projets) {
  const filtersContainer = document.querySelector(".filters-container");
  if (!filtersContainer) return;

  filtersContainer.innerHTML = "";

  const categories = [...new Set(projets.map((p) => p.category.name))];

  const btnTous = document.createElement("button");
  btnTous.textContent = "Tous";
  btnTous.classList.add("filters_container_btn");
  btnTous.addEventListener("click", () => afficherProjets(projets));
  filtersContainer.appendChild(btnTous);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.classList.add("filters_container_btn");
    btn.addEventListener("click", () => {
      const filtered = projets.filter((p) => p.category.name === cat);
      afficherProjets(filtered);
    });
    filtersContainer.appendChild(btn);
  });
}

//****Modal galerie photo****///
function afficherImagesDansModale(projets) {
  const modalGallery = document.querySelector(".modal_content_gallery");
  modalGallery.innerHTML = "";

  projets.forEach((projet) => {
    const figure = document.createElement("figure");
    figure.classList.add("modal_content_figure");

    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = "";

    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can", "delete-icon");
    trash.dataset.id = projet.id;

    trash.addEventListener("click", () => {
      supprimerProjet(projet.id);
    });

    figure.appendChild(img);
    figure.appendChild(trash);
    modalGallery.appendChild(figure);
  });
}
function supprimerProjet(id) {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        return fetch("http://localhost:5678/api/works");
      }
    })
    .then((res) => res?.json())
    .then((data) => {
      if (data) {
        afficherProjets(data);
        afficherImagesDansModale(data);
      }
    });
}

//******Modal add photo****/
const btnAddPhoto = document.getElementById("btnAddPhoto");
const modalGalerie = document.getElementById("modalGalerie");
const modalAddPhoto = document.getElementById("modalAddPhoto");
const btnBack = document.getElementById("btnBack");

btnAddPhoto.addEventListener("click", () => {
  modalGalerie.classList.add("hidden");
  modalAddPhoto.classList.remove("hidden");
});

btnBack.addEventListener("click", () => {
  modalAddPhoto.classList.add("hidden");
  modalGalerie.classList.remove("hidden");
});

const titreInput = document.getElementById("titre");
const categorieSelect = document.getElementById("categorie");
const btnValider = document.querySelector(
  "#formAddPhoto button[type='submit']"
);

fetch("http://localhost:5678/api/categories")
  .then((res) => res.json())
  .then((categories) => {
    categories.forEach((categorie) => {
      const option = document.createElement("option");
      option.value = categorie.id;
      option.textContent = categorie.name;
      categorieSelect.appendChild(option);
    });
  });

function verifierChampsFormulaire() {
  const titreOk = titreInput.value.trim() !== "";
  const categorieOk = categorieSelect.value !== "";
  btnValider.disabled = !(titreOk && categorieOk);
}

titreInput.addEventListener("input", verifierChampsFormulaire);
categorieSelect.addEventListener("change", verifierChampsFormulaire);

const inputImage = document.getElementById("image");
const previewImage = document.getElementById("previewImage");
const uploadIcon = document.getElementById("uploadIcon");
const uploadLabel = document.getElementById("uploadLabel");

inputImage.addEventListener("change", () => {
  const file = inputImage.files[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.classList.remove("hidden");

      uploadIcon.classList.add("hidden");
      uploadLabel.classList.add("hidden");
    };

    reader.readAsDataURL(file);
  }
});

const formAdd = document.getElementById("formAddPhoto");

formAdd.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) return;

  const imageFile = inputImage.files[0];
  const titre = titreInput.value.trim();
  const categorie = categorieSelect.value;

  if (!imageFile || !titre || !categorie) return;

  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("title", titre);
  formData.append("category", categorie);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) return;

    const resProjets = await fetch("http://localhost:5678/api/works");
    const projets = await resProjets.json();

    afficherProjets(projets);
    afficherImagesDansModale(projets);
    /***ask si ferme ou pas ****/
    document.getElementById("modal").classList.add("hidden")

    formAjout.reset();
    previewImage.classList.add("hidden");
    uploadIcon.classList.remove("hidden");
    uploadLabel.classList.remove("hidden");
    btnValider.disabled = true;

  } catch (err) {
    
  }
});