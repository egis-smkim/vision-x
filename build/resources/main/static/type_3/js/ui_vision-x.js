// JavaScript Document
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        this.classList.toggle('active');
        document.querySelector('.navigation').classList.toggle('active');
    });
});