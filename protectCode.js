//--code copy protection < right click and other chortcuts dissabled-- >
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'u' || e.key === 'i' || e.key === 'c')) {
        e.preventDefault();
    }
});