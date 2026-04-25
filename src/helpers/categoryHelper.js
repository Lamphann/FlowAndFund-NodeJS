const categories = {
    "Ăn uống": { color: "error", icon: "restaurant" },
    "Di chuyển": { color: "primary", icon: "directions_car" },
    "Mua sắm": { color: "primary", icon: "shopping_bag" },
    "Hóa đơn": { color: "warning", icon: "receipt_long" },
    "Lương": { color: "tertiary", icon: "payments" },
    "Khác": { color: "on-surface", icon: "label" }
};
function getCategory(categoryName) {
    return categories[categoryName] || { color: "on-surface", icon: "label" };
}

module.exports = { categories, getCategory };