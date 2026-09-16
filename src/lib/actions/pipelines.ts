import type { Document } from "mongodb";

/**
 * $lookup + $unwind stages shared by every product read query that needs
 * the category/subcategories joined in (getProducts, getOffers, getProductById).
 */
export const categoryLookupStages: Document[] = [
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  },
  { $unwind: "$category" },
  {
    $lookup: {
      from: "subcategories",
      localField: "subcategories",
      foreignField: "_id",
      as: "subcategories",
    },
  },
];

/**
 * $lookup + $unwind stage shared by order read queries that need the
 * ordering user joined in (getAllOrders, getOrderById).
 */
export const userLookupStages: Document[] = [
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  },
  { $unwind: "$user" },
];

/**
 * $lookup stage shared by every order read query that needs the ordered
 * products joined in (getAllOrders, getOrderById, getOrdersByUser).
 */
export const productItemsLookupStage: Document = {
  $lookup: {
    from: "products",
    localField: "items.productId",
    foreignField: "_id",
    as: "products",
  },
};
