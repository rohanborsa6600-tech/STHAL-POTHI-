// Layout Toggle
document.addEventListener('DOMContentLoaded', () => {
    const listToggle = document.getElementById('list-toggle');
    const gridToggle = document.getElementById('grid-toggle');
    const contentList = document.getElementById('content-list');

    // डिफॉल्ट लिस्ट
    listToggle.addEventListener('click', () => {
        contentList.classList.remove('grid');
        listToggle.classList.add('active');
        gridToggle.classList.remove('active');
    });

    // वैविध्यपूर्ण संग्रह (Grid)
    gridToggle.addEventListener('click', () => {
        contentList.classList.add('grid');
        gridToggle.classList.add('active');
        listToggle.classList.remove('active');
    });

    // Chapter Links
    document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const chapterNum = link.closest('.item-card').dataset.chapter;
            window.location.href = `chapters/chapter${chapterNum}.html`;
        });
    });
});
