let menuBar = document.querySelector('#menuBar')
let mobileMenu = document.querySelector('#mobileMenu')
let closeMenu = document.querySelector('#closeMenu')
let closeIcon = document.querySelector('#close-icon');
let filter = document.querySelector('#filter-category');
let categoryDiv = document.querySelector('#category-div');

menuBar.addEventListener('click', function () {
    mobileMenu.classList.remove('hidden')
})

closeMenu.addEventListener('click', function () {
    mobileMenu.classList.add('hidden')
})

let categoryBar = document.querySelector('#categoryBar')
let mobileCategory = document.querySelector('#mobileCategory')
let closeCategory = document.querySelector('#closeCategory')

if(categoryBar && closeCategory){
    categoryBar.addEventListener('click', function () {
        mobileCategory.classList.remove('hidden')
    })
    
    closeCategory.addEventListener('click', function () {
        mobileCategory.classList.add('hidden')
    })
}

// let the user when click to filter: the relative div appear, and when the user either click to filter or closeIcon: the relative div will disappear.
if(filter){
    let divOpen = false;
    filter.addEventListener('click', function () {
        if (divOpen) {
            categoryDiv.classList.add("hidden");
        } else {
            categoryDiv.classList.remove("hidden");
        }
        divOpen = !divOpen;
    })
    closeIcon.addEventListener('click', function () {
        categoryDiv.classList.add("hidden");
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll("[data-toggle-id]");

    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-toggle-id");
            const element = document.getElementById(targetId);
            const icon = button.querySelector("i");

            if (element) {
                element.classList.toggle("hidden");
            }

            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-bars"); // adjust if needed
            }
        });
    });
});